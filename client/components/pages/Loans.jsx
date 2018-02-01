import React, { Component } from 'react';
import LoansContainer from '../containers/LoansContainer.jsx';
import { Hero, Box, Heading, Image, Footer, Title, Paragraph, Anchor, Menu, Section, Headline, Legend, NumberInput, Columns, Value, CurrencyIcon, LinkUpIcon, Split } from 'grommet';
import Chart, { Axis, Grid, Area, Bar, Base, Layers, Line, Marker, MarkerLabel, HotSpots } from 'grommet/components/chart/Chart';
import { amortizationSchedule } from 'amortization';

console.log(amortizationSchedule(100000, 20, 8.5))

const precisionRound = (number, precision) => {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

class Loans extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      chartPrincipal: [],
      chartOutstanding: [],
      principal: 100000,
      payLevel: 850,
      interestRate: 8.5,
      term: 20,
      inception: 2017,
      totalInterestPaid: 0,
      totalPayment: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleAmort = this.handleAmort.bind(this);
  };

  handleAmort(){
    var amort = amortizationSchedule(this.state.principal, this.state.term, this.state.interestRate);
    var principal = [];
    var payments = [];
    var outstanding = [];
    var interest = [];

    amort.forEach((payment) => {
      principal.push(payment.principalBalanceRounded);
      payments.push(payment.payment);
      outstanding.push(this.state.principal - payment.principalBalanceRounded);
      interest.push(payment.interestPayment);
    })

    var totalinterest = interest.reduce((a, b) => { return a + b });
    var totalPayment = totalinterest + this.state.principal;

    this.setState({
      chartPrincipal: principal,
      chartOutstanding: outstanding,
      payLevel: payments[0],
      totalInterestPaid: precisionRound(totalinterest, 2),
      totalPayment: precisionRound(totalPayment, 2)
    })
  };

  handleChange(e){
    e.preventDefault();
    if(e.target.value > 0.1){
      this.setState({
        [e.target.name]: parseFloat(e.target.value)
      }, () => {
        this.handleAmort();
      })
    } else {
      this.setState({
        [e.target.name]: ''
      })
    }
  };

  componentWillMount(){
    this.handleAmort()
  };

  render(){
    return(
      <div>
        <Hero background={<Image src={'https://www.collegemagazine.com/wp-content/uploads/2015/03/UW-Quad.jpg'}
          fit='cover'
          full={true} />}
          backgroundColorIndex='dark'>
          <Box direction='row'
            justify='center'
            align='center'>
            <Box basis='1/2'
              align='end'
              pad='medium' />
            <Box basis='1/2'
              align='start'
              pad='medium'>
              <Heading margin='none' style={{fontSize: "55px"}} >
                Loan Balance
              </Heading>
            </Box>
          </Box>
        </Hero>
        <Section pad='large' justify='center' align='center' colorIndex='light-2' >
          <Headline margin='none'>
            <Chart style={{fontSize: "20px"}}>
              <Axis count={5}
                labels={[{"index": 2, "label": "$" + this.state.principal/2}, {"index": 4, "label": "$" + this.state.principal}]}
                vertical={true} />
              <Chart vertical={true}>
                <Base height='small'
                  width='large' />
                <Layers>
                  <Grid rows={10}
                    columns={3} />
                  <Area values={this.state.chartOutstanding}
                    colorIndex='graph-1'
                    points={true}
                    activeIndex={-1} 
                    max={this.state.principal} />
                  <Line values={this.state.chartPrincipal}
                    colorIndex='accent-1'
                    points={true}
                    activeIndex={-1} 
                    max={this.state.principal}/>
                </Layers>
                <Axis count={3}
                  labels={[{"index": 0, "label": this.state.inception}, {"index": 1, "label": Math.floor(this.state.inception + this.state.term/2)}, {"index": 2, "label": this.state.inception + this.state.term}]} />
                <Legend style={{fontSize: "20px"}} series={[{"label": "Total Paid", "colorIndex": "graph-1"}, {"label": "Balance Outstanding", "colorIndex": "accent-1"}]} />
              </Chart>
            </Chart>
          </Headline>
        </Section>
        <Split>
          <Box justify='center'
            align='center'
            pad='medium'>
            <Headline margin='none' style={{fontSize: "20px"}}>
              Loan Amount ($)
              <p />
              <NumberInput align='left' name='principal' value={this.state.principal} onChange={this.handleChange} step={1000}/>
            </Headline>
            <p />
            <Headline margin='none' style={{fontSize: "20px"}}>
              Annual Interest Rate (%)
              <p />
              <NumberInput align='left' name='interestRate' value={this.state.interestRate} onChange={this.handleChange} step={0.5}/>
            </Headline>
            <p />
            <Headline margin='none' style={{fontSize: "20px"}}>
              Loan Term (Years)
              <p />
              <NumberInput align='left' name='term' value={this.state.term} onChange={this.handleChange} />
            </Headline>
            <p />
            <Headline margin='none' style={{fontSize: "20px"}}>
              Monthly Payment ($)
              <p />
              <NumberInput align='left' name='payLevel' value={this.state.payLevel} onChange={this.handleChange} />
            </Headline>
            </Box>
            <Box align='center'
              justify='center'
              pad='large'
              margin='large'
              colorIndex='light-2'>
              <Headline margin='none' align='center' style={{fontSize: "25px"}} >
                Over loan term
                <p />
              </Headline>
              <Value value={numberWithCommas(this.state.payLevel)}
                icon={<CurrencyIcon />}
                label='Monthly Payments'
                units='$' />
                <p />
              <Value value={numberWithCommas(this.state.totalInterestPaid)}
                icon={<CurrencyIcon />}
                label='Total Interest Paid'
                units='$' />
                <p />
              <Value value={numberWithCommas(this.state.totalPayment)}
                icon={<CurrencyIcon />}
                label='Total Payment'
                units='$' />
            </Box>
        </Split>
      </div>
    )
  }
};


module.exports = Loans;