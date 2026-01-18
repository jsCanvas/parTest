import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, Layout, Typography, Button, Modal, Form, Input, Tag, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getTasks, createTask, updateTask, deleteTask } from './api';

const { Header, Content } = Layout;
const { Title } = Typography;

const COLUMNS = {
  todo: { title: 'To Do', color: '#ffe7ba' },
  doing: { title: 'In Progress', color: '#bae7ff' },
  done: { title: 'Done', color: '#d9f7be' }
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      // Sort tasks by index
      const sortedData = data.sort((a, b) => a.index - b.index);
      setTasks(sortedData);
    } catch (error) {
      console.error("Failed to load tasks", error);
      message.error("Failed to connect to backend");
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Clone tasks to avoid mutating state directly
    const newTasks = Array.from(tasks);
    const draggedTask = newTasks.find(t => t.id.toString() === draggableId);
    
    // If dropped in same column and same position, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Optimistic UI update
    // 1. Remove from old list
    const sourceColumnTasks = newTasks.filter(t => t.status === source.droppableId).sort((a,b) => a.index - b.index);
    const destColumnTasks = newTasks.filter(t => t.status === destination.droppableId).sort((a,b) => a.index - b.index);

    // This logic is simplified for demo. A real production app needs robust reordering logic.
    // Update local state first
    const updatedTask = { ...draggedTask, status: destination.droppableId };
    
    // Remove from source array locally
    const filteredTasks = newTasks.filter(t => t.id !== draggedTask.id);
    
    // Insert into new position locally (rough approximation for UI smoothness)
    // For proper persistence, we just update the status and let the backend/reload handle sort
    // But to prevent flicker, we update local state.
    
    filteredTasks.push(updatedTask);
    setTasks(filteredTasks);

    // Call API
    try {
        // We only update status and let backend handle indexing or we could calculate index here.
        // For simplicity in this demo, we just update status. 
        // A full Trello clone calculates 'index' based on surrounding items.
      await updateTask(draggedTask.id, { 
        status: destination.droppableId,
        index: destination.index // We pass index, backend should ideally handle re-indexing
      });
      loadTasks(); // Reload to get consistent server state
    } catch (error) {
      message.error("Failed to move task");
      loadTasks(); // Revert
    }
  };

  const onFinish = async (values) => {
    try {
      await createTask({ ...values, status: 'todo' });
      message.success('Task created');
      setIsModalOpen(false);
      form.resetFields();
      loadTasks();
    } catch (error) {
      message.error('Failed to create task');
    }
  };

  const handleDelete = async (id) => {
      try {
          await deleteTask(id);
          message.success('Task deleted');
          loadTasks();
      } catch (error) {
          message.error('Failed to delete task');
      }
  }

  // Helper to get tasks for a column
  const getTasksByStatus = (status) => {
    return tasks.filter(t => t.status === status).sort((a, b) => a.index - b.index);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>Kanban Board</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          New Task
        </Button>
      </Header>
      <Content style={{ padding: '24px', overflowX: 'auto' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            {Object.entries(COLUMNS).map(([columnId, column]) => (
              <div
                key={columnId}
                style={{
                  background: '#ebecf0',
                  padding: '16px',
                  borderRadius: '8px',
                  width: '300px',
                  minWidth: '300px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Title level={5} style={{ marginTop: 0, marginBottom: '16px' }}>{column.title}</Title>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ minHeight: '100px', flex: 1 }}
                    >
                      {getTasksByStatus(columnId).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ 
                                marginBottom: '8px', 
                                ...provided.draggableProps.style 
                              }}
                              size="small"
                              actions={[
                                  <DeleteOutlined key="delete" onClick={() => handleDelete(task.id)}/>
                              ]}
                            >
                              <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                              <div style={{ color: '#666', fontSize: '12px' }}>{task.description}</div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </Content>

      <Modal title="Create New Task" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Create</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default App;
