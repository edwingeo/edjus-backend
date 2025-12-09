"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsOrigins = getCorsOrigins;
exports.createApp = createApp;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
function getCorsOrigins() {
    var _a;
    return (((_a = process.env.CORS_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',').map((origin) => origin.trim()).filter(Boolean)) || [
        'https://edjus.onrender.com',
        'https://www.edjus.ca',
        'http://localhost:3000',
    ]);
}
async function createApp(adapter) {
    const app = adapter
        ? await core_1.NestFactory.create(app_module_1.AppModule, adapter)
        : await core_1.NestFactory.create(app_module_1.AppModule);
    const corsOrigins = getCorsOrigins();
    app.enableCors({
        origin: corsOrigins,
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    return app;
}
