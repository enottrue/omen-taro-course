import { useEffect } from 'react';
import { initializeUtm } from '../utils/utmUtils';

const UtmInitializer: React.FC = () => {
  useEffect(() => {
    // Инициализируем UTM метки при загрузке страницы
    initializeUtm();
  }, []);

  // Этот компонент не рендерит ничего видимого
  return null;
};

export default UtmInitializer; 