import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Typography,Space, Tag, Table, Popconfirm } from 'antd';
import { random } from 'lodash';
const { Title,Text } = Typography;
// Mảng chứa 3 món đồ để máy tính bốc thăm
const choices = ["KÉO", "BÚA", "BAO"];
const Bai1 = () => {
    // --- BƯỚC 1: TẠO "BỘ NHỚ" (STATE) ---
    // Ban đầu chưa chơi nên các lựa chọn và kết quả đều là null (rỗng)
    const [playerChoice, setPlayerChoice] = useState<string | null>(null);
    const [computerChoice, setComputerChoice] = useState<string | null>(null);
    const [matchResult, setMatchResult] = useState<string | null>(null);
    // Bộ nhớ lưu danh sách các ván đã chơi (Mảng rỗng ban đầu [])
    const [history, setHistory] = useState<any[]>([]);
    const [round, setRound] = useState<number>(1);
     // --- BƯỚC 2: TẠO "HÀNH ĐỘNG" (LOGIC TRÒ CHƠI) ---
    // Hàm này sẽ chạy khi bạn bấm vào 1 trong 3 nút Kéo/Búa/Bao
    // 1. Máy tính bốc thăm (từ 0 đến 2)
    const gamePlay = (playerSelect: string) => {
        const randomIndex = Math.floor(Math.random() * choices.length);
        const computerSelect = choices[randomIndex];
        // Cập nhật ngay lựa chọn lên màn hình
        setPlayerChoice(playerSelect);
        setComputerChoice(computerSelect);
        // 2. Trọng tài phân xử
        let result;
        if (playerSelect === computerSelect) {
            result = "HÒA";
        } else if (
            (playerSelect == "BAO" && computerSelect == "BÚA") ||
            (playerSelect == "BÚA" && computerSelect == "KÉO") ||
            (playerSelect == "KÉO" && computerSelect == "BAO")
        ) {
            result = "THẮNG";
        } else result = "THUA"

        // Cập nhật kết quả lên màn hình
        setMatchResult(result);
        
        // 3. Ghi vào sổ lịch sử
        const newRecord = {
            id: Date.now(),
            computer: computerSelect,
            player: playerSelect,
            round: round,
            result: result,
        }
        // Đẩy ván mới nhất lên đầu mảng lịch sử cũ
        setHistory([newRecord, ...history]);
        //Tăng bộ đếm round thêm 1
        setRound(round+1);
    }
    //Reset lại game
    const resetGame = () => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setMatchResult(null);
        setHistory([]);
        setRound(1);
    }
    // --- BƯỚC 3: CẤU HÌNH CỘT CHO BẢNG LỊCH SỬ ---
    const columns = [
        {title: 'Ván thứ', dataIndex: 'round', key: 'round'},
        {title: 'Bạn chọn', dataIndex: 'player', key: 'player'},
        {title: 'Máy chọn', dataIndex: 'computer', key: 'computer'},
        {
            title: 'Kết quả', dataIndex: 'result', key: 'result',
            render: (text: string) => {
                //Thắng (xanh), thua (đỏ), hòa (mặc định)
                const color = text === "THẮNG" ? "green" : text === "THUA" ? "red" : "default";
                return <Tag color = {color}>{text.toUpperCase()}</Tag>
            }
        }

    ]
    // --- BƯỚC 4: GẮN DÂY ĐIỆN VÀO GIAO DIỆN ---
    return (
        <Card title = "Bài 1: Trò chơi Oẳn tù tì">
            <Space direction='vertical' style = {{width: '100%', textAlign: 'center'}}>
                {/* KHU VỰC 1: TIÊU ĐỀ VÀ NÚT BẤM */}{/* KHU VỰC 1: TIÊU ĐỀ VÀ NÚT BẤM */}
                <Title level = {4}>Mời bạn ra tay!</Title>
            {/* Gắn sự kiện onClick gọi hàm handlePlay và truyền chữ tương ứng vào */}
            <Space size="large">
                <Button type="primary" onClick={() => gamePlay('KÉO')}>Kéo</Button>
                <Button type="primary" onClick={() => gamePlay('BÚA')}>Búa</Button>
                <Button type="primary" onClick={() => gamePlay('BAO')}>Bao</Button>
            </Space>
            {/* KHU VỰC 2: KẾT QUẢ VÁN ĐẤU */}
        
            {matchResult && (
                <div style={{ marginTop: 50, padding: 20, backgroundColor: '#f0f2f5' }}>
                {/* Hiển thị dữ liệu động*/}
                <Title level = {3}>Kết quả:</Title>
                <p>
                    <Text strong>{playerChoice}</Text> VS <Text strong>{computerChoice}</Text>
                    <br />
                    <Text strong>{matchResult}</Text>
                </p>
            </div>
            )}
            {/* KHU VỰC 3: BẢNG LỊCH SỬ */}
            <div style={{ marginTop: 30, textAlign: 'left' }}>
                <Title level = {4}> Lịch sử ván đấu</Title>
                {/* BONG BÓNG XÁC NHẬN TRƯỚC KHI RESET */}
                <Popconfirm
                    title="Bạn có chắc muốn xóa lịch sử và chơi lại từ đầu?"
                    onConfirm={resetGame} // Nếu bấm OK thì mới chạy hàm resetGame
                    okText="Đồng ý"
                    cancelText="Hủy"
                >
                    <Button danger>Khôi phục mặc định (Reset)</Button>
                </Popconfirm>
                {/*Component Table của Ant Design*/}
                <Table
                dataSource = {history}
                columns={columns}
                rowKey='id'
                pagination = {false}
                bordered

                />
            </div>
            </Space>
            
        </Card>
    )
};
export default Bai1;