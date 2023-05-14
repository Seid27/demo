
import React from "react";
import './App.css';
import {useState, useEffect} from 'react'
import {deleteStudent, getAllStudents} from "./client";
import {
    Layout,
    Menu,
    Breadcrumb,
    Table,
    Spin,
    Empty,
    Button,
    Badge,
    Tag,
    Avatar,
    Radio,
    Popconfirm,
    Divider
} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined, PlusOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import StudentDrawerForm from "./StudentDrawerForm";
import {errorNotification, successNotification} from "./Notification";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);
const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim.length === 0){
        return <Avatar icon={<UserOutlined/>}/>
    }

    const split = trim.split(" ");
    if (split.length === 1){
        return <Avatar>{name.charAt(0)}</Avatar>
    }

    return <Avatar>{`${name.charAt(0)}${name.charAt(name.length-1)}`}</Avatar>
}

function removeStudent (studentId, callback){
    deleteStudent(studentId).then(() => {
        successNotification("student Deleted", `Student with Id ${studentId} deleted`);
        callback();
    }).catch(err =>{
        err.response.json().then(res=>{
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        })
    })
}

const columns = fetchStudents => [
    {
        title:'',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text,student) => <TheAvatar name={student.name}></TheAvatar>
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (text,student) => <Radio.Group>
            <Button size="small" style={{margin: '2px'}}>Edit        </Button>
            <Popconfirm
                title={`Are you sure to delete ${student.name}?`}
                placement= 'topRight'
                onConfirm={()=> removeStudent(student.id, fetchStudents)}
            >
                <Button danger size="small">Delete</Button>
            </Popconfirm>

        </Radio.Group>
    },

];

function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);
    const fetchStudents = () => getAllStudents()
        .then(res => res.json())
        .then(data =>
        {
            console.log(data);
            setStudents(data);
            setFetching(false);
        }).catch(err=>{
            console.log(err.response)
            err.response.json().then(res => {
                console.log(res);
                errorNotification(
                    "There was an issue",
                    `${res.message}[Status code ${res.status}] [${res.error}]`)
            });
        }).finally(()=> setFetching(false))
    useEffect(() => {
        console.log("component is mounted");
        fetchStudents();

    },[]);

    const renderStudents = () => {
        if (fetching){
            return <Spin indicator={antIcon}/>
        }
        if (students.length <= 0) {

            return <>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Button type="primary" shape="round" icon={<PlusOutlined />} size="small" onClick={() => setShowDrawer(!showDrawer)}>
                    Add New Student to database
                </Button>
                <Empty/>
                </>
        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Table dataSource={students} columns={columns(fetchStudents)} bordered
                   title={() =>
                       <>
                           <Tag>Number of students</Tag>
                           <Badge count={students.length} className="site-badge-count-4"/>
                           <br/><br/>
                           <Button type="primary" shape="round" icon={<PlusOutlined />} size="small" onClick={() => setShowDrawer(!showDrawer)}>
                               Add New Student
                           </Button>
                       </>
            }
                   pagination={{
                       pageSize: 50,
                   }}
                   scroll={{
                       y: 430,}}
                   rowKey={(students) => students.id}
            />
        </>

    }

    return <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed}
               onCollapse={setCollapsed}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined />}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined />}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    {renderStudents()}
                </div>
            </Content>

            <Divider>
                <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://amigoscode.com/"> Amigos Code Website made by seid</a>
            </Divider>
            <Footer style={{ textAlign: 'center' }}>By seidTech</Footer>
        </Layout>
    </Layout>

}

export default App;
