"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
let server;
const handler = async (req, res) => {
    if (!server) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        await app.init();
        server = app.getHttpAdapter().getInstance();
    }
    return server(req, res, () => { });
};
exports.handler = handler;
if (require.main === module) {
    async function bootstrap() {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        await app.listen((process.env.PORT || 3000), '0.0.0.0');
        console.log(`Application is running on: ${await app.getUrl()}`);
    }
    bootstrap();
}
