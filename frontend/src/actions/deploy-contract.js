import axios from 'axios';
import web3 from '../utils/web3';
import {CONVERT_CURRENCIES, SHOW_MODAL} from './types';

const setWebHook = async (address, webHook) => {
  return await axios.patch(`/api/scaffolds/${address}`, {webHook});
};

export const deployContractByApi = (formValues, history) => async dispatch => {
  let res = {};
  dispatch({type: SHOW_MODAL, payload: {showModal: true}});

  try {
    res = await axios.post('/api/scaffolds/doDeploy', formValues);
    if (formValues.webHook) {
      await setWebHook(res.address, formValues.webHook);
    }
    dispatch({
      type: SHOW_MODAL,
      payload: {contract: res.data, showLoader: false},
    });
    return res.address;
  } catch (err) {
    const response = err ? err.response : null;
    const status = response ? response.status : '';
    const data = response ? response.data : null;
    const backendMessage = data ? data.message : null;
    const message = status + ': ' + (backendMessage || 'Error in deploy contract');

    dispatch({
      type: SHOW_MODAL,
      payload: {showLoader: false, error: message},
    });
    throw new Error('Error in deploy contract: ' + message);
  }
};

export const compileContract = async (openKey, properties) => {
  const response = await axios.post('/api/scaffolds/doCompile', {openKey, properties});
  return response.data;
};

export const processDeploy = async (contract, bin, formValues) => {
  return await contract.deploy({
    data: bin,
    arguments: [
      formValues.developerAddress,
      formValues.developerAddress,
      formValues.description,
      formValues.fiatAmount,
      formValues.currency,
      web3.utils.toWei(formValues.conversionAmount.toString())]
  }).send({
    from: formValues.developerAddress,
    gas: 1700000,
    gasPrice: '10000000000'
  }).on('error', (error) => console.log('>> ', error));
};

export const deployContract = (formValues) => async dispatch => {
  dispatch({type: SHOW_MODAL, payload: {showModal: true, showLoader: true}});
  try {
    const {abi, bin} = await compileContract(formValues.openKey, formValues.properties);
    const contract = new web3.eth.Contract(JSON.parse(abi));
    const newContractInstance = await processDeploy(contract, bin, formValues);

    const address = newContractInstance.options.address;
    const response = await axios.post('/api/scaffolds', {...formValues, abi, address});

    if (formValues.webHook) {
      await setWebHook(address, formValues.webHook);
    }

    dispatch({
      type: SHOW_MODAL,
      payload: {contract: response.data, showLoader: false},
    });

    return address;
  } catch (err) {

    let message = 'Error in deploy contract';
    if (err.response) {
      const response = err ? err.response : null;
      const status = response ? response.status : '';
      const data = response ? response.data : null;
      const backendMessage = data ? data.message : null;
      message = status + ': ' + (backendMessage || 'Error in deploy contract');
    } else {
      message = err.message;
    }

    dispatch({
      type: SHOW_MODAL,
      payload: {showLoader: false, error: message},
    });
    throw new Error(message);
  }
};

export const convertCurrencies = conversionValues => async dispatch => {
  const fromAmount = conversionValues.fromAmount ? conversionValues.fromAmount : '0';
  const fromCurrency = conversionValues.fromCurrency ? conversionValues.fromCurrency : 'usd';
  const toCurrency = conversionValues.toCurrency ? conversionValues.toCurrency : 'eth';
  let res = {};
  const apiRequestUrl = `https://openexchangerates.org/api/convert/${fromAmount}/${fromCurrency}/${toCurrency}?app_id=d34199d67d85445a846040c0cf621510`;

  try {
    res = await axios.get(apiRequestUrl);
    dispatch({type: CONVERT_CURRENCIES, payload: res.data.response});
    return res.data.response;
  } catch (err) {
    console.log('Error in convertCurrencies', err);
  }
};
