(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__29d7ca3b._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Desktop/Code/Newer/Projet-Perso/portfolio-new/New-Portfolio/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Code$2f$Newer$2f$Projet$2d$Perso$2f$portfolio$2d$new$2f$New$2d$Portfolio$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Code/Newer/Projet-Perso/portfolio-new/New-Portfolio/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Code$2f$Newer$2f$Projet$2d$Perso$2f$portfolio$2d$new$2f$New$2d$Portfolio$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Code/Newer/Projet-Perso/portfolio-new/New-Portfolio/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
function middleware(request) {
    // Check if the request is for the admin dashboard
    if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
        const adminSession = request.cookies.get("admin_session");
        // If no admin session, redirect to admin login
        if (!adminSession) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Code$2f$Newer$2f$Projet$2d$Perso$2f$portfolio$2d$new$2f$New$2d$Portfolio$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/admin", request.url));
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Code$2f$Newer$2f$Projet$2d$Perso$2f$portfolio$2d$new$2f$New$2d$Portfolio$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/admin/dashboard/:path*"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__29d7ca3b._.js.map