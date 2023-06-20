import React, { useEffect, useState } from 'react';
import PivotTableUI from 'react-pivottable';
import 'react-pivottable/pivottable.css';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const PivotTableUISmartWrapper = () => {
  const [data, setData] = useState([]);
  const [pivotState, setPivotState] = useState({ data, pivotState: {} });

  const fetchDataFromAPI = () => {
    const apiUrl = 'http://127.0.0.1:8000/api/ventas';

    axios
      .get(apiUrl)
      .then(response => {
        if (response.status === 200) {
          const data = response.data;
          setData(data);
        } else {
          console.error('Error al obtener datos desde la API. Estado de respuesta:', response.status);
          alert('Error al obtener datos desde la API. Por favor, intenta nuevamente más tarde.');
        }
      })
      .catch(error => {
        console.error('Error al obtener datos desde la API:', error);
        alert('Error al obtener datos desde la API. Por favor, intenta nuevamente más tarde.');
      });
  };

  const exportToExcel = () => {
    const table = document.querySelector('.pvtTable');
    if (!table) {
      console.warn('No se encontró la tabla.');
      return;
    }

    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'pivot_table_data.xlsx');
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  useEffect(() => {
    setPivotState(prevState => ({ ...prevState, data }));
  }, [data]);

  return (
    <div>
      <div>
        <button onClick={exportToExcel}>Exportar a Excel</button>
      </div>
      <PivotTableUI
        {...pivotState}
        onChange={s => {
          setPivotState(s);
          //console.log(s.data);
        }}
        unusedOrientationCutoff={Infinity}
      />
    </div>
  );
};

const App = () => {
  return <PivotTableUISmartWrapper />;
};

export default App;