#Файл конфигурации для sequelize-auto
```
sequelize-auto.json
```

#Автоматическая генерация моделей для sequelize
```
npm run dev:build_db_models
```

#Создать директорию для ключей
```
mkdir ./src/utils/jwt/keys/

#Приватный RSA ключ для генерации refresh token
```
openssl genrsa -out ./src/utils/jwt/keys/refreshTokenPrivateKey.pem 2048
```
#Экспорт открытого ключа для проверки refresh token
```
openssl rsa -in ./src/utils/jwt/keys/refreshTokenPrivateKey.pem -outform PEM -pubout -out ./src/utils/jwt/keys/refreshTokenPublicKey.pem
```


#Приватный RSA ключ для генерации refresh token
```
openssl genrsa -out ./src/utils/jwt/keys/accessTokenPrivateKey.pem 2048
```
#Экспорт открытого ключа для проверки refresh token
```
openssl rsa -in ./src/utils/jwt/keys/accessTokenPrivateKey.pem -outform PEM -pubout -out ./src/utils/jwt/keys/accessTokenPublicKey.pem
```
