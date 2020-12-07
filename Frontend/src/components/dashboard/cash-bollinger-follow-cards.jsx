import React, { useState, useEffect, useContext, useCallback } from "react";
import CompanyContext from "../../contexts/company"
import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Col,
    Row
} from 'reactstrap';
import { Line } from 'react-chartjs-2';
import axios from 'axios'

const CashBollingerFollowCards = () => {
    const [bandChartData, setBandChartData] = useState({})
    const [chartData, setChartData] = useState({})
    const [lastDate, setLastDate] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const { state } = useContext(CompanyContext)

    const getData = useCallback(async () => {
        setLoading(true)
        setError(false)
        let date = new Date()
        date.setFullYear(date.getFullYear() - 1)
        await axios.get("/Strategy", {
            params: {
                "type": "following",
                "company": state.company,
                "date": date.toISOString()
            }
        }).then(res => {
            let MA20Data = res.data.bandchart.MA20
            let closeData = res.data.bandchart.close
            let daysData = res.data.bandchart.days
            let upperData = res.data.bandchart.upper
            let lowerData = res.data.bandchart.lower
            let MFIData = res.data.chart.MFI10
            let PBData = res.data.chart.PB.map(function(e) {
                return e * 100
            })
            let chartDaysData = res.data.chart.days
            let buyData = res.data.buy.map(function(e) {
                return {x: e[0], y: e[1]}
            })
            let sellData = res.data.sell.map(function(e) {
                return {x: e[0], y: e[1]}
            })

            if (daysData.length === 0) {
                setLoading(false)
                setError(true)
                return
            }

            setLastDate(String(daysData[daysData.length - 1]))

            setChartData({
                labels: chartDaysData,
                datasets: [
                    // MFI10
                {
                    label: "following - MFI10",
                    fill: false,
                    lineTension: 0.1,
                    borderColor: 'lightgreen',
                    borderCapStyle: 'butt',
                    borderDash: [5, 5],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointRadius: 0,
                    data: MFIData
                },
                    // PB
                {
                    label: "following - PB",
                    fill: false,
                    lineTension: 0.1,
                    borderColor: 'skyblue',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointRadius: 0,
                    data: PBData
                },
            ]})

            setBandChartData({
                labels: daysData,
                datasets: [
                    // buy
                {
                    label: "following - buy",
                    fill: true,
                    showLine: false,
                    pointRadius: 7,
                    pointBackgroundColor: 'red',
                    pointBorderColor: 'red',
                    pointStyle: 'triangle',
                    data: buyData
                },
                    // sell
                {
                    label: "following - sell",
                    fill: true,
                    showLine: false,
                    pointRadius: 7,
                    pointBackgroundColor: 'blue',
                    pointBorderColor: 'blue',
                    pointStyle: 'triangle',
                    pointRotation: 180,
                    data: sellData
                },
                    // moving average 20
                {
                    label: "following - MA20",
                    fill: false,
                    lineTension: 0.1,
                    borderColor: 'green',
                    borderCapStyle: 'butt',
                    borderDash: [5, 5],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointRadius: 0,
                    data: MA20Data
                },
                    // close
                {
                    label: "following - close",
                    fill: false,
                    lineTension: 0.1,
                    borderColor: 'blue',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointRadius: 0,
                    data: closeData
                },
                    // lower
                {
                    label: "following - lower",
                    fill: false,
                    lineTension: 0.1,
                    borderColor: 'cyan',
                    borderCapStyle: 'butt',
                    borderDash: [5, 5],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointRadius: 0,
                    data: lowerData
                },
                    // upper
                {
                    label: "following - upper",
                    fill: false,
                    lineTension: 0.1,
                    borderColor: 'red',
                    borderCapStyle: 'butt',
                    borderDash: [5, 5],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointRadius: 0,
                    data: upperData
                },
            ]})
            setLoading(false);
        }).catch(function (e) {
            setLoading(false)
            setError(true);
        })
    }, [state])
    
    useEffect(() => {
        getData()
    }, [getData]);

    if (loading) {
        return  (
            <Card>
                <CardTitle className="bg-light border-bottom p-3 mb-0">
                    <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                    로딩 페이지
                </CardTitle>
                <CardBody className="">
                    <strong>볼린저 밴드 - 추세 로딩 페이지 입니다. 잠시만 기다려주세요</strong>
                </CardBody>
            </Card>
        );
    }
    if (error) {
        return  (
            <Card>
                <CardTitle className="bg-light border-bottom p-3 mb-0">
                    <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                    에러 페이지
                </CardTitle>
                <CardBody className="">
                    <strong>검색하신 기업은 등록되어 있지 않은 기업입니다. 다시 검색해주세요</strong>
                </CardBody>
            </Card>
        );
    }

    return (
        <div>
            <Card>
                <CardBody>
                    <div className="d-flex align-items-center">
                        <div>
                            <CardTitle>종목 정보 : { state.company }</CardTitle>
                            <CardSubtitle>마지막 업데이트 날짜 : { lastDate }</CardSubtitle>
                        </div>
                        <div className="ml-auto d-flex align-items-center">
                            <ul className="list-inline font-12 dl mr-3 mb-0">
                                <li className="border-0 p-0 list-inline-item" style={{color: "blue"}}>
                                    <i className="fa fa-circle"></i> Close
                                </li>
                                <li className="border-0 p-0 list-inline-item" style={{color: "red"}}>
                                    <i className="fa fa-circle"></i> Upper
                                </li>
                                <li className="border-0 p-0 list-inline-item" style={{color: "green"}}>
                                    <i className="fa fa-circle"></i> Moving Average 20
                                </li>
                                <li className="border-0 p-0 list-inline-item" style={{color: "cyan"}}>
                                    <i className="fa fa-circle"></i> Lower
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Row>
                        <Col lg="12">
                            <div className="campaign ct-charts">
                                <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 500 }}>
                                    <Line data={bandChartData} options={{ maintainAspectRatio: false, hover: { mode: false }, legend: { display: false }, tooltips: { enabled: false }, scales: { yAxes: [{ gridLines: { display: true } }], xAxes: [{ gridLines: { display: true }}] } }} />
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="ml-auto d-flex align-items-center">
                                        <ul className="list-inline font-12 dl mr-3 mb-0">
                                            <li className="border-0 p-0 list-inline-item" style={{color: "skyblue"}}>
                                                <i className="fa fa-circle"></i> %B
                                            </li>
                                            <li className="border-0 p-0 list-inline-item" style={{color: "lightgreen"}}>
                                                <i className="fa fa-circle"></i> MFI10
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 500 }}>
                                    <Line data={chartData} options={{ maintainAspectRatio: false, hover: { mode: false }, legend: { display: false }, tooltips: { enabled: false }, scales: { yAxes: [{ gridLines: { display: true } }], xAxes: [{ gridLines: { display: true }}] } }} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    );
}

export default CashBollingerFollowCards;
