import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import Busboy from "busboy";
import { initializeRgaaReferential } from "../db";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Initialiser le référentiel RGAA (thématiques + critères) au démarrage
  await initializeRgaaReferential();
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Route de connexion dev locale (sans OAuth)
  app.get("/api/dev-login", (_req, res) => {
    res.redirect(302, "/");
  });

  // Route pour l'upload de fichiers
  app.post("/api/audit/upload", async (req, res) => {
    try {
      // Créer un contexte utilisateur avec les paramètres corrects
      const opts = { req, res, info: { type: "http" } as any };
      const context = await createContext(opts as any);
      if (!context.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Parser FormData avec busboy
      const bb = Busboy({ headers: req.headers, limits: { fileSize: 50 * 1024 * 1024 } });
      let fileName = "report.docx";
      let fileBuffer: Buffer | null = null;

      bb.on("file", (fieldname, file, info) => {
        fileName = info.filename;
        const chunks: Buffer[] = [];

        file.on("data", (data) => {
          chunks.push(Buffer.from(data));
        });

        file.on("end", () => {
          fileBuffer = Buffer.concat(chunks);
        });

        file.on("error", (error) => {
          console.error("File stream error:", error);
        });
      });

      bb.on("close", async () => {
        try {
          if (!fileBuffer) {
            return res.status(400).json({ message: "No file provided" });
          }

          // Appeler la procédure uploadReport via le caller
          const caller = appRouter.createCaller(context);
          const result = await caller.audit.uploadReport({
            fileName,
            fileData: fileBuffer,
          });

          res.json(result);
        } catch (error) {
          console.error("Upload error:", error);
          const message = error instanceof Error ? error.message : "Upload failed";
          res.status(500).json({ message });
        }
      });

      bb.on("error", (error) => {
        console.error("Busboy error:", error);
        res.status(400).json({ message: "Invalid form data" });
      });

      req.pipe(bb);
    } catch (error) {
      console.error("Upload error:", error);
      const message = error instanceof Error ? error.message : "Upload failed";
      res.status(500).json({ message });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
