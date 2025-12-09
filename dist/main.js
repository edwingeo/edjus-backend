"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const create_app_1 = require("./create-app");
let server;
const handler = async (req, res) => {
    if (!server) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({ origin: (0, create_app_1.getCorsOrigins)(), credentials: true });
        await app.init();
        server = app.getHttpAdapter().getInstance();
    }
    return server(req, res, () => { });
};
exports.handler = handler;
if (require.main === module) {
    async function bootstrap() {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({ origin: (0, create_app_1.getCorsOrigins)(), credentials: true });
        await app.listen((process.env.PORT || 3000), '0.0.0.0');
        console.log(`Application is running on: ${await app.getUrl()}`);
    }
    bootstrap();
}
