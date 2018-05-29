import React, {Component} from 'react';
import {Card, Grid} from 'semantic-ui-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import web3 from '../../utils/web3';
import WithdrawFundsForm from '../WithdrawFundsForm';
// Actions
import {convertCurrencies, fetchSummaryOnchain} from '../../actions';

class ScaffoldSummary extends Component {

    componentDidMount() {
        const {match: {params}, actions} = this.props;
        actions.fetchSummaryOnchain(params);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props === nextProps) return;
        const fromAmount = nextProps.onchainScaffoldSummary.balance ? nextProps.onchainScaffoldSummary.balance : 0;
        const fromCurrency = 'eth';
        const toCurrency = nextProps.onchainScaffoldSummary.fiatCurrency;

        this.props.actions.convertCurrencies({
            fromAmount: web3.utils.fromWei(fromAmount, 'ether'),
            fromCurrency,
            toCurrency
        });
    }

    render() {
        const {onchainScaffoldSummary, currencyConversionValue} = this.props;
        // convert scaffoldBalance from wei to Ether
        const scaffoldBalance = onchainScaffoldSummary.balance
            ? web3.utils.fromWei(onchainScaffoldSummary.balance, 'ether')
            : 0;
        // convert scaffoldAmount from wei to Ether
        const scaffoldAmount = onchainScaffoldSummary.scaffoldAmount
            ? web3.utils.fromWei(onchainScaffoldSummary.scaffoldAmount, 'ether')
            : 0;

        return (
            <div style={{marginTop: '20px'}}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={9}>
                            <Card fluid>
                                <Card.Content
                                    header="On-chain Scaffold Summary"
                                    meta="This data is coming from the Ethereum Network"
                                />
                                <Card.Content>
                                    <div>
                                        Scaffold Description:{' '}
                                        {
                                            onchainScaffoldSummary.scaffoldDescription
                                        }
                                    </div>
                                    <div>
                                        Scaffold Owner Address:{' '}
                                        {onchainScaffoldSummary.vendorAddress}
                                    </div>
                                </Card.Content>
                                <Card.Content>
                                    <div>
                                        <div style={{width: '64%', display: 'inline-block'}}>
                                            Scaffold Amount:{' '}
                                            {(Number.parseFloat(scaffoldAmount)).toFixed(5)} ether
                                        </div>
                                        <div style={{width: '34%', display: 'inline-block'}}>
                                            {(Number.parseInt(onchainScaffoldSummary.fiatAmount, 10) / 100).toFixed(2)}{' '}
                                            {onchainScaffoldSummary.fiatCurrency}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{width: '64%', display: 'inline-block'}}>
                                            Scaffold Balance:{' '}
                                            {(Number.parseFloat(scaffoldBalance)).toFixed(5)} ether
                                        </div>
                                        <div style={{width: '34%', display: 'inline-block'}}>
                                            {currencyConversionValue ? currencyConversionValue.toFixed(2) : 0}{' '}
                                            {onchainScaffoldSummary.fiatCurrency}
                                        </div>
                                    </div>
                                    <div>
                                        Scaffold Transactions:{' '}
                                        {onchainScaffoldSummary.transactions}
                                    </div>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column width={7}>
                            <WithdrawFundsForm/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column/>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = ({auth, onchainScaffoldSummary, currencyConversionValue}) => {
    return {auth, onchainScaffoldSummary, currencyConversionValue};
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({fetchSummaryOnchain, convertCurrencies}, dispatch),
});

ScaffoldSummary = connect(mapStateToProps, mapDispatchToProps)(ScaffoldSummary);

export default ScaffoldSummary;
