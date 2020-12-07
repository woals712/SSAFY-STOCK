import React, { useState, useEffect, useContext, useCallback } from "react";
import CompanyContext from "../../contexts/company";
import axios from 'axios';
import Paginate from './Paginate';
import './abc.css';

import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Table,
    Button,
    Input,
} from 'reactstrap';

const BackTestCards = () => {
    const [cash, setCash] = useState(1000000);
    const [cashA, setCashA] = useState(0);
    const [code, setCode] = useState("");
    const [data, setData] = useState([]);
    const [showdata, setShowdata] = useState([]);
    const [lastupdate, setLastupdate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const { state } = useContext(CompanyContext);

    const onChangePage = (pageOfItems) => setShowdata(pageOfItems);

    const cash_f = e => {
        axios.get('/Backtest', {
            params: {
                "company": state.company,
                "cash": cash,
                "code": code,
            }
        }).then(res => {
            setCashA(res.data['af_end_price']);
            setData(res.data['table'].reverse());
            setLastupdate(res.data['last_update']);
            setCode(res.data['code']);
            setLoading(false);
        }).catch(function (e) {
            setLoading(false)
            setError(true);
        })
    }

    const getData = useCallback(async () => {
        setLoading(true)
        setError(false)
        await axios.get('/Backtest', {
            params: {
                "company": state.company,
                "cash": cash,
                "code": code,
            }
        }).then(res => {
            setCashA(res.data['af_end_price']);
            setData(res.data['table'].reverse());
            setLastupdate(res.data['last_update']);
            setCode(res.data['code']);
            setLoading(false);
        }).catch(function (e) {
            setLoading(false)
            setError(true);
        })
    }, [state])

    useEffect(() => {
        getData()
    }, [getData])

    if (loading) {
        return (
            <Card>
                <CardTitle className="bg-light border-bottom p-3 mb-0">
                    <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                    로딩 페이지
                </CardTitle>
                <CardBody className="">
                    <strong>백테스트 로딩 페이지 입니다. 잠시만 기다려주세요</strong>
                </CardBody>
            </Card>
        );
    }
    if (error) {
        return (
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
                        <CardSubtitle>마지막 업데이트 날짜 : {lastupdate}</CardSubtitle>
                    </div>

                    <div className="ml-auto d-flex no-block align-items-center">
                        <div className="dl">
                            금액설정 : &nbsp;&nbsp;&nbsp;
                            <Input
                                type="text"
                                value={cash}
                                onChange={e => { setCash(e.target.value); }}
                                placeholder="원하는 시가를 넣어주세요"
                                id="cashing"
                            />
                            &nbsp;&nbsp;&nbsp;
                            <Button className="btn" color="info" onClick={cash_f}>
                                설정 금액 : {cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}&nbsp;₩
                            </Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button className="btn" color="danger">
                                최종 금액 : {Math.round(cashA).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}&nbsp;₩
                            </Button>
                        </div>
                    </div>
                </div>
                <Table className="no-wrap v-middle" responsive>
                    <thead>
                        <tr className="border-0">
                            <th className="border-0">종목명</th>
                            <th className="border-0">날짜</th>
                            <th className="border-0">구분</th>
                            <th className="border-0">주가</th>
                            <th className="border-0">수량</th>
                            <th className="border-0">수수료</th>
                            <th className="border-0">자산</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showdata.map((unit, i) =>
                            <tr key={i}>
                                <td>
                                    <div className="d-flex no-block align-items-center">
                                        <div className="">
                                            <h5 className="mb-0 font-16 font-medium">{state.company}</h5><span>코드 : {code}</span></div>
                                    </div>
                                </td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.date}</td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.buy}</td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.price}₩</td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.size}</td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.comm}₩</td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.value}₩</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Paginate data={data} onChangePage={onChangePage} />
            </CardBody>
        </Card>
    );
}

export default BackTestCards;
