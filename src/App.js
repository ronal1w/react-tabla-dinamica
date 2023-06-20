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
          console.error('Error fetching data from API. Response status:', response.status);
          alert('Error fetching data from API. Please try again later.');
        }
      })
      .catch(error => {
        console.error('Error fetching data from API:', error);
        alert('Error fetching data from API. Please try again later.');
      });
  };

  const exportToExcel = () => {
    if (!pivotState.data || pivotState.data.length === 0) {
      console.warn('No hay datos para exportar.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(pivotState.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    saveAsExcelFile(excelBuffer, 'pivot_table_data.xlsx');
  };

  const saveAsExcelFile = (buffer, fileName) => {
    const data = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, fileName);
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
        onChange={s => setPivotState(s)}
        unusedOrientationCutoff={Infinity}
      />
    </div>
  );
};

const App = () => {
  return <PivotTableUISmartWrapper />;
};

export default App;
