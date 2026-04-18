import React from 'react';
import { Card, Progress } from 'antd';
import { useModel } from 'umi';
import styles from '../style.less';

const BudgetChart: React.FC = () => {
  const { budgetInfo } = useModel('BaiTap6.useBudget');

  return (
    <Card className={styles.cardContainer} title="Mức độ tiêu hao ngân sách">
      <div className={styles.chartWrapper}>
        <Progress
          type="dashboard"
          percent={budgetInfo.percentage}
          status={budgetInfo.isExceeded ? 'exception' : 'normal'}
          strokeColor={budgetInfo.isExceeded ? '#ff4d4f' : '#52c41a'}
          width={200} 
        />
      </div>
    </Card>
  );
};

export default BudgetChart;