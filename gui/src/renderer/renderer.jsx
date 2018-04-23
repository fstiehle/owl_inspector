import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom'

// import React Components
import Layout from './components/Layout.jsx';

ReactDOM.render(
<HashRouter>
  <Layout />
</HashRouter>, 
document.getElementById('content'));