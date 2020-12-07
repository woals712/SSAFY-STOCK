import React, { useState, useEffect, useContext, useCallback } from "react";
import CompanyContext from "../../contexts/company"
import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Col,
    Row,
    Button,
} from 'reactstrap';
import { Line } from 'react-chartjs-2';
import axios from 'axios'

const BackPredictCards = () => {
    const [bandChartData, setBandChartData] = useState({})
    const [predictedValue, setPredictedValue] = useState(0)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const { state } = useContext(CompanyContext)

    const getData = useCallback(async () => {
        setLoading(true)
        setError(false)
        let enddate = new Date()
        let startdate = new Date(new Date().setFullYear(enddate.getFullYear() - 2))
        await axios.get("/Predict", {
            params: {
                "company": state.company,
                "start_date": startdate.toISOString().split("T")[0],
                "end_date": enddate.toISOString().split("T")[0]
            }
        }).then(res => {
            let daysData = res.data.chart.day
            let pData = res.data.chart.pdata
            let tData = res.data.chart.tdata
            let price = res.data.price

            if (daysData.length === 0) {
                setLoading(false)
                setError(true)
                return
            }

            price = price.split("[")[1].split("]")[0]

            setPredictedValue(price * 1.0)

            setBandChartData({
                labels: daysData,
                datasets: [
                    {
                        label: 'predict - pdata',
                        fill: false,
                        lineTension: 0.1,
                        borderColor: 'blue',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointRadius: 0,
                        data: pData
                    },
                    {
                        label: 'predict - tdata',
                        fill: false,
                        lineTension: 0.1,
                        borderColor: 'red',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointRadius: 0,
                        data: tData
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
                    <strong>RNN 주가 예측 로딩 페이지 입니다. 잠시만 기다려주세요</strong>
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
                    <strong>알수 없는 오류 입니다. 새로고침을 해주세요</strong>
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
                            <CardTitle>종목 정보 : {state.company}</CardTitle>
                            <CardSubtitle>마지막 업데이트 날짜 : {new Date().toISOString().split("T")[0]}</CardSubtitle>
                        </div>
                        <div className="ml-auto d-flex no-block align-items-center">
                            <div className="dl">
                                <Button className="btn" color="info">
                                    예측 종가 : {Math.round(predictedValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ₩
                                </Button>
                            </div>
                        </div>
                        <div className="ml-auto d-flex align-items-center">
                            <ul className="list-inline font-12 dl mr-3 mb-0">
                                <li className="border-0 p-0 list-inline-item" style={{color: "red"}}>
                                    <i className="fa fa-circle"></i> 실제 주가
                                </li>
                                <li className="border-0 p-0 list-inline-item" style={{color: "blue"}}>
                                    <i className="fa fa-circle"></i> 예상 주가
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Row>
                        <Col lg="12">
                            <div className="campaign ct-charts">
                                <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 250 }}>
                                    <Line data={bandChartData} options={{ maintainAspectRatio: false, hover: { mode: false }, legend: { display: false }, tooltips: { enabled: false }, scales: { yAxes: [{ gridLines: { display: true } }], xAxes: [{ gridLines: { display: true }}] } }} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    );
}

export default BackPredictCards;
