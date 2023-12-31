import { JSDOM } from 'jsdom';
import request from 'request';
import fs from 'fs';

const get = (url, ctype = 'text/html;', encoding = 'utf8') => {
    return new Promise((resolve, reject) => {
        request.get({
            uri: url,
            headers: { 'Content-type': ctype },
            encoding,
        }, function (err, req, data) {
            resolve(data);
        });
    });
}

const url = `https://www.hpcs.cs.tsukuba.ac.jp/members`;

const html = await get(url);

const doc = new JSDOM(html).window.document;

const members = doc.querySelectorAll('.member_item');

members.forEach(async (member) => {
    const frag = JSDOM.fragment(member.outerHTML);
    const name = frag.querySelector('.member_name').innerHTML;
    const occ = frag.querySelectorAll('.member_info li')[0].innerHTML;
    const team = frag.querySelectorAll('.member_info li')[1].innerHTML;
    const img = frag.querySelector('.member_image img').getAttribute('src');
    const username = frag.querySelector('.mailaddr').getAttribute('user');

    let data = {
        name: '',
        eng_name: '',
        occupation: '',
        grade: '',
        team: '',
        img: '',
        username: '',
    };

    if (name.includes('/')) {
        data.name = name.split('/')[0].trim();
        data.eng_name = name.split('/')[1].trim();
    } else {
        data.eng_name = name;
    }

    switch (occ) {
        case '研究生 / Research Student':
            data.occupation = 'Research Student';
            data.grade = '';
            break;
        case '学生 (B4) / Student (B4)':
            data.occupation = 'Student';
            data.grade = 'B4';
            break;
        case '学生 (M1) / Student (M1)':
            data.occupation = 'Student';
            data.grade = 'M1';
            break;
        case '学生 (M2) / Student (M2)':
            data.occupation = 'Student';
            data.grade = 'M2';
            break;
        case '学生 (D1) / Student (D1)':
            data.occupation = 'Student';
            data.grade = 'D1';
            break;
        case '学生 (D2) / Student (D2)':
            data.occupation = 'Student';
            data.grade = 'D2';
            break;
        case '学生 (D3) / Student (D3)':
            data.occupation = 'Student';
            data.grade = 'D3';
            break;
        case '教員 (教授) / Faculty (Professor)':
            data.occupation = 'Faculty';
            data.grade = 'Professor';
            break;
        case '教員 (准教授) / Faculty (Associate Professor)':
            data.occupation = 'Faculty';
            data.grade = 'Associate Professor';
            break;
        case '教員 (助教) / Faculty (Assistant Professor)':
            data.occupation = 'Faculty';
            data.grade = 'Assistant Professor';
            break;
        case '教員 (教授 (連携大学院)) / Faculty (Professor (Cooperative Graduate School Program))':
            data.occupation = 'Faculty';
            data.grade = 'Professor (Cooperative Graduate School Program)'
            break;
        case '研究員 / Researcher':
            data.occupation = 'Researcher';
            data.grade = '';
            break;
    }

    switch (team) {
        case 'Algorithm Team':
            data.team = 'Algorithm';
            break;
        case 'System Software Team':
            data.team = 'System Software';
            break;
        case 'FPGA Team':
            data.team = 'FPGA';
            break;
        case 'Architecture Team':
            data.team = 'Architecture';
            break;
        case 'PA Team':
            data.team = 'PA';
            break;
        case 'Performance Team':
            data.team = 'Performance';
            break;
    }

    const imgdata = await get(img, 'image/jpeg;', null);
    const imgpath = img.split('/').slice(-1)[0];

    fs.writeFile(`static/uploads/${imgpath}`, imgdata, err => {
        if (err) {
            console.error(err);
        }
    });

    data.img = imgpath;

    data.username = username;

    const text =
        `---
name: '${data.name}'
eng_name: '${data.eng_name}'
occupation: '${data.occupation}'
grade: '${data.grade}'
team: '${data.team}'
img: '/uploads/${data.img}'
username: '${data.username}'
---
`;
    fs.writeFile(`members/profiles/${data.username}.md`, text, err => {
        if (err) {
            console.error(err);
        }
    });
});
