import React, { useState, useEffect, useContext, useCallback } from "react";
import CompanyContext from "../../contexts/company"
import axios from 'axios'
import Paginate from './Paginate'

import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Table,
} from 'reactstrap';

const InfoCards = () => {
    //const [code, setCode] = useState("000020");
    const [data, setData] = useState([]);
    const [showdata, setShowdata] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [lastupdate, setLastupdate] = useState('');

    const { state } = useContext(CompanyContext);

    const onChangePage = (pageOfItems) => setShowdata(pageOfItems);

    const getData = useCallback(async () => {
        setLoading(true)
        setError(false)
        await axios.get('/DailyPrice', {
            params: {
                "company": state.company,
            }
        }).then(res => {
            setData(res.data['table'].reverse());
            setLastupdate(res.data['last_update'])
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
        return (
            <Card>
                <CardTitle className="bg-light border-bottom p-3 mb-0">
                    <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                    로딩 페이지
                </CardTitle>
                <CardBody className="">
                    <strong>시세 조회를 위한 로딩 페이지 입니다. 잠시만 기다려주세요</strong>
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
                </div>
                <Table className="no-wrap v-middle" responsive>
                    <thead>
                        <tr className="border-0">
                            <th className="border-0">종목명</th>
                            <th className="border-0">날짜</th>
                            <th className="border-0">시가</th>
                            <th className="border-0">종가</th>
                            <th className="border-0">고가</th>
                            <th className="border-0">저가</th>
                            <th className="border-0">전일비</th>
                            <th className="border-0">거래량</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showdata.map((unit, i) => (
                            <tr key={i}>
                                <td>
                                    <div className="d-flex no-block align-items-center">
                                        <div className="">
                                            <h5 className="mb-0 font-16 font-medium">{state.company}</h5><span>코드 : {unit.code}</span></div>
                                    </div>
                                </td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.date}</td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.open.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}&nbsp;₩</td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.close.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}&nbsp;₩</td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.high.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}&nbsp;₩</td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.low.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}&nbsp;₩</td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.diff.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className="blue-grey-text  text-darken-4 font-medium">{unit.volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}&nbsp;건</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Paginate data={data} onChangePage={onChangePage} />
            </CardBody>
        </Card>
    );
}

export default InfoCards;
