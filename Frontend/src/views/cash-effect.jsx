import React from 'react';
import {
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
} from 'reactstrap';
import { CashEffectCards } from 'components/dashboard';

const TextStyle = {
    cursor: 'pointer',
};

const naverLink = () => {
    document.location.href = "https://terms.naver.com/entry.nhn?docId=1137565&cid=40942&categoryId=31825"
}

const CashEffectComponent = () => {
    return (
        <div>
            <Row>
                <Col sm={12} lg={12}>
                    <Card>
                        <CardTitle className="bg-light border-bottom p-3 mb-0">
                            <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                            <strong>현대 포트폴리오 이론 - 효율적 투자선</strong> 
                        </CardTitle>
                        <CardBody className="">
                            <strong>투자자가 인내할 수 있는 리스트 수준에서 최상의 기대수익률을 제공하는 포트폴리오의 집합</strong><br/>
                            <strong>X축은 리스크(표준편차) / Y축은 예상 수익률(평균)</strong><br/><br/>
                            <strong>샤프지수는 측정된 위험 단위당 수익률을 계산합니다.</strong><br/>
                            <strong>KOSPI 시총 4개 종목을 비교 해여, 측정된 위험 단위당 수익이 가장 높은 포트폴리오를 구할 수 있습니다.</strong><br/>
                            <strong>샤프지수가 가장 큰 포트폴리오를 붉은 사각형으로 표시했고, 가장 낮은 포트폴리오를 붉은 엑스표로 표기했습니다.</strong><br/><br/>
                            <u style={TextStyle}><strong onClick={naverLink}>위 링크를 클릭하여 현대 포트폴리오 이론 설명 사이트로 넘어갈 수 있습니다.</strong></u><br/>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} lg={12}>
                    <h5 className="mb-3">Chart</h5>
                </Col>
                <Col sm={12} lg={12}>
                    <CashEffectCards />
                </Col>
            </Row>
        </div>
    );
}

export default CashEffectComponent;