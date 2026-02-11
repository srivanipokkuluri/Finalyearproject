import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatInput from "../components/ChatInput";
import FloatingActionButton from "../components/FloatingActionButton";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-900" />
          <div className="text-sm font-semibold tracking-tight text-slate-900">AI Template Editor</div>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Login
          </Link>
          <Link
            to="/templates"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Start Editing
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-8">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <section>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              AI Template Editor
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-slate-600">
              Pick a poster template, edit on a canvas, and trigger AI actions like background removal, enhancement,
              and caption generation.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/templates")}
                className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Start Editing
              </button>
              <Link
                to="/login"
                className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Mock Login
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-900">Templates</div>
                <div className="mt-1 text-xs text-slate-600">JSON-driven layouts</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-900">Canvas</div>
                <div className="mt-1 text-xs text-slate-600">Drag and position layers</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-900">AI Tools</div>
                <div className="mt-1 text-xs text-slate-600">Mock API actions</div>
              </div>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-slate-100 via-white to-slate-100" />
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Demo Flow</div>
                      <div className="mt-1 text-sm text-slate-600">Templates → Editor → Preview</div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Ready for demo
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm font-semibold text-slate-900">1) Select a template</div>
                      <div className="mt-1 text-sm text-slate-600">Choose from a clean poster gallery.</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm font-semibold text-slate-900">2) Edit on canvas</div>
                      <div className="mt-1 text-sm text-slate-600">Select layers, drag, and update text styles.</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm font-semibold text-slate-900">3) Run AI actions</div>
                      <div className="mt-1 text-sm text-slate-600">Remove background, enhance, generate caption.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <ChatInput />
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 text-xs text-slate-500">
          <div>Final Year Project • AI-powered template editor</div>
        </div>
      </footer>

      <FloatingActionButton />
    </div>
  );
}
