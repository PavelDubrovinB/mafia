#!/bin/bash

# Сборка проекта
yarn build

# Копирование файлов в папку docs для GitHub Pages
cp -r build/* docs/

echo "Готово! Теперь можно коммитить и пушить в GitHub"
echo "Сайт будет доступен по адресу: https://ваш-username.github.io/mafia2"
