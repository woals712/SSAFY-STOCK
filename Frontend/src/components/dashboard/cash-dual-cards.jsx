import React, { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Row,
    Table
} from 'reactstrap';
import axios from 'axios'

const CashDualCards = () => {
    const [AMData, setAMData] = useState({})
    const [RMData, setRMData] = useState({})
    const [AMResult, setAMResult] = useState(0)
    const [RMResult, setRMResult] = useState(0)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const getData = useCallback(async () => {
        setLoading(true)
        setError(false)
        await axios.get("/Strategy", {
            params: {
                "type": "dual",
                "start_date": new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
                "middle_date": new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(),
                "end_date": new Date().toISOString()
            }
        }).then(res => {
            setAMData(res.data.am)
            setRMData(res.data.rm)

            let results = res.data.dual.split("   ")
            setRMResult(Math.round((results[0] * 1.0) * 1000) / 1000)
            setAMResult(Math.round((results[1] * 1.0) * 1000) / 1000)
            setLoading(false);
        }).catch(function (e) {
            setLoading(false)
            setError(true);
        })
    }, [])
    
    useEffect(() => {
        getData()
    }, []);

    if (loading) {
        return  (
            <Card>
                <CardTitle className="bg-light border-bottom p-3 mb-0">
                    <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                    로딩 페이지
                </CardTitle>
                <CardBody className="">
                    <strong>듀얼 모멘텀 로딩 페이지 입니다. 잠시만 기다려주세요</strong>
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
        <Card>
            <CardBody>
                <CardTitle>절대적 모멘텀</CardTitle>
                <Row>
                    <Col lg="12">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>코드</th>
                                    <th>회사</th>
                                    <th>시작 가격</th>
                                    <th>최종 가격</th>
                                    <th>수익률</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(10)].map((value, index) => (
                                    <tr key={index} className="table-primary">
                                        {Object.keys(RMData).map((n, i) => (
                                            <td key={i}>{RMData[n][index]}</td>
                                        ))}
                                    </tr>
                                ))}
                                <tr className="table-primary" style={{textAlign: "center"}}>
                                    <td colSpan="2">종합 수익률</td>
                                    <td colSpan="3">{RMResult}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </CardBody>
            <CardBody>
                <CardTitle>상대적 모멘텀</CardTitle>
                <Row>
                    <Col lg="12">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>코드</th>
                                    <th>회사</th>
                                    <th>시작 가격</th>
                                    <th>최종 가격</th>
                                    <th>수익률</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(10)].map((value, index) => (
                                    <tr key={index} className="table-success">
                                        {Object.keys(AMData).map((n, i) => (
                                            <td key={i}>{AMData[n][index]}</td>
                                        ))}
                                    </tr>
                                ))}
                                <tr className="table-success" style={{textAlign: "center"}}>
                                    <td colSpan="2">종합 수익률</td>
                                    <td colSpan="3">{AMResult}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}

export default CashDualCards;
