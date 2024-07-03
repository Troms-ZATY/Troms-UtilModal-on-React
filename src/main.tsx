import React from 'react';
import ReactDOM from 'react-dom/client';
import UtilModal from './UtilModal';


const App = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Click me</button>

      <UtilModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        test
      </UtilModal>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);