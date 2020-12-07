import React from 'react';
import {
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
} from 'reactstrap';
import { CashBollingerFollowCards } from 'components/dashboard';

const TextStyle = {
    cursor: 'pointer',
};

const naverLink = () => {
    document.location.href = "https://terms.naver.com/entry.nhn?docId=3571973&cid=58781&categoryId=58781"
}

const CashBollingerFollowComponent = () => {
    return (
        <div>
            <Row>
                <Col sm={12} lg={12}>
                    <Card>
                        <CardTitle className="bg-light border-bottom p-3 mb-0">
                            <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                            <strong>현대 포트폴리오 이론 - 볼린저 밴드 추세 추종 매매기법</strong> 
                        </CardTitle>
                        <CardBody className="">
                            <strong>추세 추종은 상승 추세에 매수하고 하락 추세에 매도하는 기법입니다.</strong><br/>
                            <strong>현금흐름지표(MFI)나 일중강도(II) 같은 거래량 관련 지표를 이용해 매수/매도에 들어갑니다.</strong><br/>
                            <strong>매수 조건은 MFI가 80보다 클 때로 붉은색 삼각형 / 매도 조건은 MFI가 20보다 작을 때로 파란색 삼각형입니다.</strong><br/><br/>

                            <strong>상단 볼린저 밴드는 상대적인 고점을 나타내며, 하단 볼린저 밴드는 상대적인 저점을 나타냅니다.</strong><br/>
                            <strong>밴드폭이 좁을수록 주가 변동성이 작고, 밴드폭이 넓을 수록 주가 변동성이 큽니다.</strong><br/>
                            <strong>네이버 종가 (close), 상단 볼린저 밴드 (upper), 중간 볼린저 밴드 (MA20), 하단 볼린저 밴드 (lower)</strong><br/><br/>

                            <strong>밴드폭 (%b)는 현재 주가가 어디 쯤에 있는지를 수치로 나타낸 것입니다.</strong><br/>
                            <strong>현금흐름지표 (MFI) 지표가 80을 상회하면 아주 강력한 매수 신호이며, 20을 하회하면 아주 강력한 매도 신호입니다.</strong><br/><br/>
                            <u style={TextStyle}><strong onClick={naverLink}>위 링크를 클릭하여 볼린저 밴드 설명 사이트로 넘어갈 수 있습니다.</strong></u><br/>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} lg={12}>
                    <h5 className="mb-3">Chart</h5>
                </Col>
                <Col sm={12} lg={12}>
                    <CashBollingerFollowCards />
                </Col>
            </Row>
        </div>
    );
}

export default CashBollingerFollowComponent;