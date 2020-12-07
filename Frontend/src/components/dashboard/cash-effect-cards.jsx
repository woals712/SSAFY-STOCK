import React, { useState, useEffect, useContext, useCallback } from "react";
import CompanyContext from "../../contexts/company"
import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Row,
    Table
} from 'reactstrap';
import { Scatter } from 'react-chartjs-2';
import axios from "axios";

const CashEffectCards = () => {
    const [ chartData, setChartData ] = useState({})
    const [ maxPortData, setMaxPortData ] = useState({})
    const [ minPortData, setMinPortData ] = useState({})
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { state } = useContext(CompanyContext)

    const getData = useCallback(async () => {
        setLoading(true)
        setError(false)
        let date = new Date()
        date.setFullYear(date.getFullYear() - 1)
        await axios.get('/Strategy', {
            params: {
                "type": "efficient",
                "company": [state.company, "현대자동차", "NAVER", "SK하이닉스"],
                "start_date": date.toISOString(),
                "end_date": new Date().toISOString()
            }
        }).then(res => {
            let portfolioData = res.data.risk.Risk.map((val, i) => {
                return {x: val, y: res.data.returns.Returns[i]}
            })
            let maxData = {
                "risk": res.data.max.Risk[0],
                "returns": res.data.max.Returns[0],
                "sharpe": res.data.max.Sharpe[0]
            }
            let minData = {
                "risk": res.data.min.Risk[0],
                "returns": res.data.min.Returns[0],
                "sharpe": res.data.min.Sharpe[0]
            }

            setMaxPortData(res.data.max)
            setMinPortData(res.data.min)

            setChartData({
                datasets: [
                    {
                        label: "effect - max",
                        data: [{x: maxData.risk, y: maxData.returns}],
                        fill: true,
                        pointRadius: 7,
                        pointBackgroundColor: "red",
                        pointBorderColor: "red",
                        pointStyle: "rect"
                    },
                    {
                        label: "effect - min",
                        data: [{x: minData.risk, y: minData.returns}],
                        fill: true,
                        pointRadius: 7,
                        pointBackgroundColor: "red",
                        pointBorderColor: "red",
                        pointBorderWidth: 3,
                        pointStyle: "crossRot"
                    },
                    {
                        label: "effect - portfolios",
                        data: portfolioData,
                        fill: true,
                        pointBackgroundColor: "blue",
                        pointBorderColor: "blue"
                    },
                ]
            })
            setLoading(false)
        }).catch(e => {
            setLoading(false)
            setError(true)
        })
    }, [state])

    useEffect(() => {
        getData()
    }, [getData])

    if (loading) {
        return  (
            <Card>
                <CardTitle className="bg-light border-bottom p-3 mb-0">
                    <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                    로딩 페이지
                </CardTitle>
                <CardBody className="">
                    <strong>효율적 투자선 로딩 페이지 입니다. 잠시만 기다려주세요</strong>
                </CardBody>
            </Card>
        );
    }
    if (error && (state.company === "현대자동차" || state.company === "NAVER" || state.company === "SK하이닉스")) {
        return  (
            <Card>
                <CardTitle className="bg-light border-bottom p-3 mb-0">
                    <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                    에러 페이지
                </CardTitle>
                <CardBody className="">
                    <strong>현대자동차, NAVER, SK하이닉스는 효율적 투자선 비교 차트에 있는 기업이기 때문에 검색 불가입니다.</strong>
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
                    </div>
                </div>
                <Row>
                    <Col lg="12">
                        <div className="campaign ct-charts">
                            <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 250 }}>
                                <Scatter data={chartData} options={{ maintainAspectRatio: false, hover: { mode: false }, legend: { display: false }, tooltips: { enabled: false }, scales: { yAxes: [{ gridLines: { display: true } }], xAxes: [{ gridLines: { display: true } }] } }} />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="12">
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th></th>
                                    {Object.keys(maxPortData).map((value, index) => (
                                        <th key={index}>{value}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="table-primary">
                                    <th scope="row">Risk 대비 최대 Return</th>
                                    {Object.keys(maxPortData).map((value, index) => (
                                        <th key={index}>{Math.round(maxPortData[value] * 1000) / 1000}</th>
                                    ))}
                                </tr>
                                <tr className="table-success">
                                    <th scope="row">최소 Risk</th>
                                    {Object.keys(minPortData).map((value, index) => (
                                        <th key={index}>{Math.round(minPortData[value] * 1000) / 1000}</th>
                                    ))}
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}

export default CashEffectCards;
