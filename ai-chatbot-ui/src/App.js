import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import TemplateGallery from "./pages/TemplateGallery";

const Editor = React.lazy(() => import("./pages/Editor"));
const Preview = React.lazy(() => import("./pages/Preview"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-full bg-slate-50">
          <div className="mx-auto w-full max-w-6xl px-6 py-10 text-sm text-slate-600">Loading…</div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/templates" element={<TemplateGallery />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
