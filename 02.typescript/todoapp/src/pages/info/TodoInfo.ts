// 할일 등록
import './TodoInfo.css';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import axios from 'axios';
import { linkTo } from '../../Router';
import { Button, BackEvent, DeleteEvent } from '../utils/buttonUtils';
import { createCheckLabel } from '../list/Content';

const TodoInfo = async function () {
  const params = new URLSearchParams(location.search);
  const _id = params.get('_id');
  const page = document.createElement('div');
  page.setAttribute('id', 'page');

  const header = Header('할일 상세 내용');
  header.className = 'Todo-header TodoInfo-header';

  const section = document.createElement('section');
  try {
    const response = await axios<TodoResponse>(
      `http://localhost:33088/api/todolist/${_id}`
    );
    //createCheckLabel =>
    const data = response?.data.item;

    const title = document.createElement('h2');
    const titleText = document.createTextNode(data.title);
    title.appendChild(titleText);
    title.className = 'Todo-title';

    const content = document.createElement('div');
    const contentText = document.createTextNode(data.content);
    content.appendChild(contentText);
    content.className = 'TodoInfo-content';

    //삭제, 수정 버튼 그룹화
    const btnGroup = document.createElement('div');
    btnGroup.className = 'TodoInfo-btnGroup';
    header.appendChild(btnGroup);

    const editBtn = Button('editButton', '수정하기', editEvent);
    function editEvent() {
      const queryString = `?_id=${data._id}`;
      history.pushState({}, 'update', queryString);
      linkTo(`update${queryString}`);
    }
    btnGroup.appendChild(editBtn);

    const deleteBtn = Button(
      'deleteButton',
      '삭제하기',
      () => _id && DeleteEvent(_id)
    );
    btnGroup.appendChild(deleteBtn);

    const backBtn = Button('backButton', '뒤로가기', BackEvent);
    backBtn.className = 'backButton';
    header.appendChild(backBtn);

    //contentInfo
    const contentInfo = document.createElement('div');
    contentInfo.className = 'TodoInfo-contentInfo';

    //생성날짜, 업데이트 날짜 그룹화
    const dateGroup = document.createElement('div');
    dateGroup.className = 'TodoInfo-dateGroup';
    contentInfo.appendChild(dateGroup);

    //생성 날짜
    const createDate = document.createElement('p');
    const createdAt = document.createTextNode(`생성일 : ${data.createdAt}`);
    createDate.appendChild(createdAt);
    dateGroup.appendChild(createDate);

    //업데이트 날짜
    const updateDate = document.createElement('p');
    const updatedAt = document.createTextNode(`최종수정일 : ${data.updatedAt}`);
    updateDate.appendChild(updatedAt);
    dateGroup.appendChild(updateDate);

    //Checkbox + 완료, 미완료 표시
    const doneContainer = document.createElement('div');
    doneContainer.className = 'TodoInfo-container';
    doneContainer.style.display = 'flex';

    //Checkbox
    const checkBox = document.createElement('div');
    checkBox.className = 'TodoInfo-checkbox';
    const checkLabel = createCheckLabel(data);
    const done = checkLabel[1] as HTMLInputElement;
    done.addEventListener('click', async (e) => {
      const target = e.target as HTMLInputElement;
      try {
        const body = {
          title: data.title,
          content: data.content,
          done: target.checked,
        };
        const res = await axios.patch(
          `http://localhost:33088/api/todolist/${data._id}`,
          body
        );
        const text = document.querySelector<HTMLSpanElement>('.TodoInfo-tag');
        if (res.data.item.done === true && text) {
          text.innerText = '할 일 완료';
          text.style.color = '#3D53C7';
        }
        if (res.data.item.done === false && text) {
          text.innerText = '할 일 미완료';
          text.style.color = '#666666';
        }
      } catch (err) {
        alert('수정 실패');
        console.error(err);
      }
    });
    if (data.done) {
      done.checked = true;
    }

    checkBox.appendChild(checkLabel[0]);

    //완료, 미완료 표시
    const tag = document.createElement('span');
    tag.className = 'TodoInfo-tag';
    tag.style.fontSize = '24px';
    const complete = document.createTextNode('할 일 완료');
    const inComplete = document.createTextNode('할 일 미완료');
    if (data.done === true) {
      tag.appendChild(complete);
      tag.style.color = '#3D53C7';
    } else {
      tag.appendChild(inComplete);
      tag.style.color = '#666666';
    }

    doneContainer.append(checkBox, tag);

    contentInfo.appendChild(doneContainer);
    section.appendChild(title);
    section.appendChild(content);
    section.appendChild(contentInfo);
  } catch (error) {
    console.log(error);
  }

  page.appendChild(header);
  page.appendChild(section);
  page.appendChild(Footer());

  return page;
};

export default TodoInfo;
