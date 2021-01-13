export default (): AppConfig => ({
  mongoUrl: process.env.ES_MONGODB_URL,
  hashSecret: process.env.ES_HASH_SECRET,
  hashAlgorithm: process.env.ES_HASH_ALGO,
  jwtSecret: process.env.ES_JWT_SECRET,
  openFoodUserAgent: process.env.ES_OPENFOOD_USERAGENT,
});

export interface AppConfig {
  mongoUrl: string;
  hashSecret: string;
  hashAlgorithm: string;
  jwtSecret: string;
  openFoodUserAgent: string;
}
