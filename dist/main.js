"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./prisma.service");
const swagger_1 = require("@nestjs/swagger");
const transform_interceptor_1 = require("./transform.interceptor");
const helmet = require("helmet");
const compression = require("compression");
async function bootstrap() {
    const logger = new common_1.Logger();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.use(helmet());
    app.use(compression());
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Cottage Demon blog')
        .setDescription(`below you'll find all available calls to the API`)
        .setVersion('0.1')
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api', app, swaggerDocument);
    const prismaService = app.get(prisma_service_1.PrismaService);
    prismaService.enableShutdownHooks(app);
    const port = +process.env.PORT;
    await app.listen(port);
    logger.verbose(`🚀 App is running and listening on port: ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map