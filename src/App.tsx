import { useState } from 'react';
import axios from 'axios';
import './App.css';
import FileUpload from './Dropzone';

interface HighRiskResult {
  testName: string;
  observedValue: string;
  units: string;
  everlabRange: string;
  standardRange: string;
  condition: string
}

const ApiUrl = 'http://ec2-3-148-209-229.us-east-2.compute.amazonaws.com/api/upload'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [highRiskResults, setHighRiskResults] = useState<HighRiskResult[] | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setHighRiskResults(null);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select an ORU file.');
      return;
    }

    setLoading(true);
    setUploadError(null);
    setHighRiskResults(null);

    const formData = new FormData();
    formData.append('oruFile', selectedFile);

    try {
      const response = await axios.post(ApiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setHighRiskResults(response.data);
    } catch (error: unknown) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload and process the file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>ORU Report Analyzer</h1>

      <FileUpload
        onChange={handleFileChange}
      />

      <button onClick={handleUpload} className='btn-upload' disabled={!selectedFile || loading}>
        {loading ? 'Processing...' : 'Upload and Analyze'}
      </button>

      {uploadError && <p className="error">{uploadError}</p>}

      {Array.isArray(highRiskResults) && highRiskResults.length > 0 && (
        <div className='results'>
          <h2>High-Risk Results</h2>
          <table>
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Condition</th>
                <th>Observed Value</th>
                <th>Units</th>
                <th>Everlab Range</th>
                <th>Standard Range</th>
              </tr>
            </thead>
            <tbody>
              {highRiskResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.testName}</td>
                  <td>{result.condition || ' - '}</td>
                  <td>{result.observedValue}</td>
                  <td>{result.units}</td>
                  <td>{result.everlabRange}</td>
                  <td>{result.standardRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Array.isArray(highRiskResults) && highRiskResults.length === 0 && !loading && <div className='no-data-found'>No high risk results found</div>}
    </div>
  );
}

export default App;