import React from 'react';
import TableRenderers from '../src/TableRenderers';
import createPlotlyComponent from 'react-plotly.js/factory';
import createPlotlyRenderers from '../src/PlotlyRenderers';
import PivotTableUI from '../src/PivotTableUI';
import '../src/pivottable.css';
import axios from 'axios';



const Plot = createPlotlyComponent(window.Plotly);

class PivotTableUISmartWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { pivotState: props };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ pivotState: nextProps });
  }

  render() {
    return (
      <PivotTableUI
        renderers={Object.assign(
          {},
          TableRenderers,
          createPlotlyRenderers(Plot)
        )}
        {...this.state.pivotState}
        onChange={(s) => this.setState({ pivotState: s })}
        unusedOrientationCutoff={Infinity}
      />
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'api',
      filename: 'Data from API',
      pivotState: { data: [] },
    };
  }

  componentDidMount() {
    this.fetchDataFromAPI();
  }

  fetchDataFromAPI() {
    const apiUrl = 'http://127.0.0.1:8000/api/ventas';
  
    axios
      .get(apiUrl)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data; // Obtenemos los datos del arreglo de objetos directamente
  
          this.setState({
            mode: 'api',
            filename: 'Data from API',
            pivotState: { data },
          });
          
        } else {
          console.error('Error fetching data from API. Response status:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error fetching data from API:', error);
      });
  }
  
  
  

  render() {
    return (
      <div>
        <div className="row text-center">
          <div className="col-md-3 col-md-offset-3"></div>
        </div>
        <div className="row">
          <h2 className="text-center">{this.state.filename}</h2>
          <br />

          {this.state.mode === 'api' ? (
            <PivotTableUISmartWrapper {...this.state.pivotState} />
          ) : (
            <p>Loading data from API...</p>
          )}
        </div>
      </div>
    );
  }
}
