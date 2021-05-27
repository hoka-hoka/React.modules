import VisitorCounter from './VisitorCounter/Index';
import SmartHouse from './SmartHouse/Index';

export const integ = {
  types: [
    {
      name: 'Контроллер сбора данных',
      value: '1',
    },
    {
      name: 'Контроллер для вывода на ТВ',
      value: '2',
    },
    {
      name: 'API',
      value: '3',
    },
    {
      name: 'Коннектор к RELABIT',
      value: '10',
    },
    {
      name: 'E-mail',
      value: '4',
    },
    {
      name: 'Телефония',
      value: '5',
    },
    {
      name: 'Внешний колл-центр',
      value: '6',
    },
    {
      name: 'Оплаты из 1С',
      value: '7',
    },
    {
      name: 'Счётчик посетителей',
      value: '8',
      alias: VisitorCounter,
      props: ['applyAction', 'notice'],
      data: {
        info: [
          {
            id: 1,
            name: 'address',
            type: 'text',
            prompt: 'адрес сервера',
          },
          {
            id: 2,
            name: 'port',
            type: 'number',
            prompt: 'порт',
          },
          {
            id: 3,
            name: 'login',
            type: 'text',
            prompt: 'логин',
          },
          {
            id: 4,
            name: 'pass',
            type: 'text',
            prompt: 'пароль',
          },
        ],
        encrypt: ['Без шифрования', 'TLS', 'Устаревший TLS', 'Устаревший SSL'],
        titles: ['Актив', 'Драйвер', 'FTP-путь', 'Интервал сбора данных'],
        drivers: ['MaxCounter', 'VideoCounter'],
      },
      send: 'counters',
    },
    {
      name: 'Карта объекта',
      value: '9',
    },
    {
      name: 'Коннектор к мобильному приложению RELABIT MALL',
      value: '11',
    },
    {
      name: 'Контроллер доступа и времени',
      value: '12',
    },
    {
      name: 'Контроллер сбора банковских данных',
      value: '13',
    },
    {
      name: 'Умный дом',
      value: '14',
      token: true,
      alias: SmartHouse,
      props: ['applyAction', 'notice'],
      data: {
        devices: [
          { name: 'Телефонный звонок', titles: ['Тип', 'Телефон', 'Актив'] },
          { name: 'Контроллер Relabit', titles: ['Тип', 'URL', 'Актив'] },
        ],
        types: {
          phone: 0,
          contr: 1,
        },
      },
      send: 'devices',
    },
  ],
};

export const smartHouse = {};

export const lang = [
  'Наименование',
  'Тип',
  'Перегенерировать',
  'Описание',
  'Отмена',
  'Применить',
  'Токен',
  'Уведомление',
  'Закрыть',
  'Восстановить',
  'Список устройств',
  'Устройство',
  'удалено',
  'Доступ разрешён',
  'Да',
  'Нет',
  'FTP для сбора данных',
  'Выберите',
  'Неверный id актива',
];

export const langData = {
  name: 0,
  type: 1,
  regenerate: 2,
  about: 3,
  cancel: 4,
  apply: 5,
  token: 6,
  notice: 7,
  close: 8,
  recover: 9,
  devList: 10,
  device: 11,
  del: 12,
  available: 13,
  yes: 14,
  no: 15,
  ftp: 16,
  select: 17,
  acttive: 18,
};
