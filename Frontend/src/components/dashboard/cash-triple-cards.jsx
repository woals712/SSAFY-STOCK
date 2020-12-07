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
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios'

const CashTripleCards = () => {
    const [EMAChartData, setEMAChartData] = useState({})
    const [MACDChartData, setMACDChartData] = useState({})
    const [KDChartData, setKDChartData] = useState({})
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
                "type": "triple",
                "company": state.company,
                "date": date.toISOString()
            }
        }).then(res => {
            let EMAData = res.data.ema130.ema130
            let MACDHistData = res.data.macdchart.macdhist
            let fastKData = res.data.kdchart.fast_k
            let slowDData = res.data.kdchart.slow_d
            let daysData = res.data.kdchart.days
            let buyData = res.data.buy.map(function(e) {
                return {x: e[0], y: Math.min.apply(null, EMAData)}
            })
            let sellData = res.data.sell.map(function(e) {
                return {x: e[0], y: Math.min.apply(null, EMAData)}
            })

            if (daysData.length === 0) {
                setLoading(false)
                setError(true)
                return
            }

            setLastDate(String(daysData[daysData.length - 1]))

            setEMAChartData({
                labels: daysData,
                datasets: [
                    // buy
                    {
                        label: "Triple - buy",
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
                        label: "Triple - sell",
                        fill: true,
                        showLine: false,
                        pointRadius: 7,
                        pointBackgroundColor: 'blue',
                        pointBorderColor: 'blue',
                        pointStyle: 'triangle',
                        pointRotation: 180,
                        data: sellData
                    },
                    {
                        label: "Triple - EMA130",
                        fill: false,
                        lineTension: 0.1,
                        borderColor: 'skyblue',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointRadius: 0,
                        data: EMAData
                    }
                ]
            })

            setMACDChartData({
                labels: daysData,
                datasets: [
                    {
                        label: "Triple - MACD",
                        backgroundColor: "purple",
                        borderColor: 'purple',
                        data: MACDHistData
                    }
                ]
            })

            setKDChartData({
                labels: daysData,
                datasets: [
                    {
                        label: "Triple - Fast K",
                        fill: false,
                        lineTension: 0.1,
                        borderColor: 'seagreen',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointRadius: 0,
                        data: fastKData
                    },
                    {
                        label: "Triple - Slow D",
                        fill: false,
                        lineTension: 0.1,
                        borderColor: 'black',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointRadius: 0,
                        data: slowDData
                    }
                ]
            })
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
                    <strong>삼중창 매매 로딩 페이지 입니다. 잠시만 기다려주세요</strong>
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
        <Card>
            <CardBody>
                <div className="d-flex align-items-center">
                    <div>
                        <CardTitle>종목 정보 : {state.company}</CardTitle>
                        <CardSubtitle>마지막 업데이트 날짜 : {lastDate}</CardSubtitle>
                    </div>
                    <div className="ml-auto d-flex align-items-center">
                        <ul className="list-inline font-12 dl mr-3 mb-0">
                            <li className="border-0 p-0 list-inline-item" style={{color: "skyblue"}}>
                                <i className="fa fa-circle"></i> EMA130
                            </li>
                        </ul>
                    </div>
                </div>
                <Row>
                    <Col lg="12">
                        <div className="campaign ct-charts">
                            <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 250 }}>
                                    <Line data={EMAChartData} options={{ maintainAspectRatio: false, hover: { mode: false }, legend: { display: false }, tooltips: { enabled: false }, scales: { yAxes: [{ gridLines: { display: true } }], xAxes: [{ gridLines: { display: true }}] } }} />
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="ml-auto d-flex align-items-center">
                                    <ul className="list-inline font-12 dl mr-3 mb-0">
                                        <li className="border-0 p-0 list-inline-item" style={{color: "purple"}}>
                                            <i className="fa fa-circle"></i> MACD-Hist
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 250 }}>
                                <Bar data={MACDChartData} options={{ maintainAspectRatio: false, hover: { mode: false }, legend: { display: false }, tooltips: { enabled: false }, scales: { yAxes: [{ gridLines: { display: false } }], xAxes: [{ gridLines: { display: false }, barThickness: 1 }] } }} />
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="ml-auto d-flex align-items-center">
                                    <ul className="list-inline font-12 dl mr-3 mb-0">
                                        <li className="border-0 p-0 list-inline-item" style={{color: "seagreen"}}>
                                            <i className="fa fa-circle"></i> %K
                                        </li>
                                        <li className="border-0 p-0 list-inline-item" style={{color: "black"}}>
                                            <i className="fa fa-circle"></i> %D
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 250 }}>
                                    <Line data={KDChartData} options={{ maintainAspectRatio: false, hover: { mode: false }, legend: { display: false }, tooltips: { enabled: false }, scales: { yAxes: [{ gridLines: { display: true } }], xAxes: [{ gridLines: { display: true }}] } }} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}

export default CashTripleCards;
