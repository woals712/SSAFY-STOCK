import React from 'react';
import {
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
} from 'reactstrap';
import { InfoCards } from 'components/dashboard';

const TextStyle = {
    cursor: 'pointer',
};

const naverLink = () => {
    document.location.href = "https://finance.naver.com/"
}

const Info = () => {
    return (
        <div>
            <Row>
                <Col sm={12} lg={12}>
                    <Card>
                        <CardTitle className="bg-light border-bottom p-3 mb-0">
                            <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                            <strong>시세 조회</strong> 
                        </CardTitle>
                        <CardBody className="">
                            <strong>네이버 금융 데이터 기반 기업별 시세 조회 서비스 입니다.</strong><br/>
                            <strong>일별 시세 데이터를 확인 가능하며, 네이버 API를 통해 제공되는 서비스 입니다.</strong><br/><br/>
                            <u style={TextStyle}><strong onClick={naverLink}>위 링크를 클릭하여 네이버 금융 사이트로 이동 가능합니다.</strong></u><br/>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} lg={12}>
                    <h5 className="mb-3">Table</h5>
                </Col>
                <Col sm={12} lg={12}>
                    <InfoCards />
                </Col>
            </Row>
        </div>
    );
}

export default Info;