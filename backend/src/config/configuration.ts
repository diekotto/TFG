export default (): AppConfig => ({
  mongoUrl: process.env.ES_MONGODB_URL,
  jwtSecret: process.env.ES_JWT_SECRET,
  openFoodUserAgent: process.env.ES_OPENFOOD_USERAGENT,
});

export interface AppConfig {
  mongoUrl: string;
  jwtSecret: string;
  openFoodUserAgent: string;
}
