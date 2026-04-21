from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config.database import db
from routes.auth_routes import router as auth_router
from routes.board_routes import router as board_router
from routes.list_routes import router as list_router
from routes.task_routes import router as task_router
from routes.ai_routes import router as ai_router
from routes.analytics_routes import router as analytics_router
from middleware.error_handler import register_exception_handlers
from config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    await connect_db()
    print("✅ Connected to MongoDB")
    yield
    await close_db()
    print("🔴 Disconnected from MongoDB")


app = FastAPI(
    title="Smart Task Manager API",
    description="Task/Project Management App for Students & Developers",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Exception handlers ────────────────────────────────────────────────────────
register_exception_handlers(app)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router,      prefix="/api/auth",      tags=["Auth"])
app.include_router(board_router,     prefix="/api/boards",    tags=["Boards"])
app.include_router(list_router,      prefix="/api/lists",     tags=["Lists"])
app.include_router(task_router,      prefix="/api/tasks",     tags=["Tasks"])
app.include_router(ai_router,        prefix="/api/ai",        tags=["AI"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])


@app.get("/", tags=["Health"])
async def root():
    return {"message": "Smart Task Manager API is running 🚀", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}