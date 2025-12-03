"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function createApp(adapter) {
    const app = adapter
        ? await core_1.NestFactory.create(app_module_1.AppModule, adapter)
        : await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    return app;
}
