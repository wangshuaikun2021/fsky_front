import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import router from './routes';
import { store } from './redux/store';
import AuthInitializer from './components/AuthInitializer';
import './styles/global.css';

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <AuthInitializer>
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </AuthInitializer>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
