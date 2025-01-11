Запуск проекта

С папки backend запускаем терминал
### `npm run start`
С папки frontend запускаем терминал
### `npm start`

Убедитесь, что совместимы и корректно работают последние версии фреймворков и библиотек:

React
Redux
React Router
Node.js
Nest.js
MongoDB
WebSocket

[backend-url]: http://localhost:3000
[frontend-url]: http://localhost:3001


## Далее общая информация для меня, решил пока не убирать

# Метод: DELETE
URL: http://localhost:3000/users/delete
{
  "email": "admin@example.com"
}
# Метод: POST
http://localhost:3000/users/register
{
  "email": "admin@example.com",
  "password": "adminPassword",
  "name": "Admin User",
  "role": "admin"
}
# Метод: GET (покажет всех пользователей)
http://localhost:3000/users