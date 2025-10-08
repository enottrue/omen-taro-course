# UI Components

Этот каталог содержит переиспользуемые UI компоненты для проекта.

## Button

Универсальный компонент кнопки с различными вариантами стилей.

### Props

- `children` - содержимое кнопки (обязательный)
- `variant` - вариант стиля кнопки (опциональный, по умолчанию 'primary')
- `onClick` - обработчик клика (опциональный)
- `className` - дополнительные CSS классы (опциональный)
- `disabled` - состояние отключения (опциональный, по умолчанию false)
- `type` - тип кнопки (опциональный, по умолчанию 'button')
- `icon` - иконка для кнопки (опциональный)
- `loading` - состояние загрузки (опциональный, по умолчанию false)
- `loadingText` - текст при состоянии загрузки (опциональный, по умолчанию 'Loading...')

### Variants

- `primary` - основная кнопка записи (белая с синим текстом)
- `secondary` - вторичная кнопка (растягивается на всю ширину)
- `video` - кнопка для видео (с иконкой)
- `enroll` - кнопка записи с ценой

### Примеры использования

```tsx
import { Button } from '../ui';

// Основная кнопка
<Button variant="primary" onClick={handleClick}>
  Enroll Now — Start Today
</Button>

// Кнопка с иконкой
<Button 
  variant="video" 
  icon={<img src="/icon.svg" alt="" />}
>
  Watch the Video
</Button>

// Вторичная кнопка
<Button variant="secondary">
  Start Today
</Button>

// Кнопка записи
<Button variant="enroll">
  Get the first lesson for free
</Button>

// Кнопка с состоянием загрузки
<Button 
  variant="enroll" 
  loading={isLoading}
  loadingText="Redirecting..."
  onClick={handlePayment}
>
  Get the first lesson for free
</Button>
```

### Особенности

- Все кнопки имеют hover и active состояния
- Адаптивный дизайн для мобильных устройств
- Поддержка отключенного состояния
- Поддержка состояния загрузки с автоматическим отключением кнопки
- При состоянии загрузки скрывается иконка и отображается текст загрузки
- Плавные анимации при взаимодействии 