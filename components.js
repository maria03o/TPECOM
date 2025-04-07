import * as dom from './lib/Dom.js';
import * as constants from './constants.js';
import {request} from './request.js';
import * as storage from './lib/Storage.js';


export let div = dom.make_element;
export let select = () => div('select');
export let option = () => div('option'); 
export let button = () => div('button');
export let input = () => div('input');



function get_remark_func(remark) {
	return storage.get_local_storage(constants.remarks)[remark];
}

export let result_element = div('result-view').text('Result view');

// function naming :
// - name_view : takes data and displays it by using name_component
// - name_component : takes data as argument and returns a component
// - name_request : sends a request to get the data and returns it
// - name : does everything, gets the data and displays it
// - name_func : just a function takes input and returns output

// variable naming :
// - name : data
// - name_element : dom element


// components

export function show_major_student_component() {
	return button().text('Afficher major').event('click', () => {
		show_major_student();
	})
}
export function show_all_students_component() {
	return button().text('Afficher etudiants').event('click', () => {
		show_all_students();
	})
}
export function init_students_component() {
	return button().text('Initialiser etudiants').event('click', () => {
		init_students();
	})
}

const SEARCH = 0;
const REMOVE = 1;
function _compontent(functinality) {
	
	let component = null;
	if (functinality == REMOVE)
		component = div('remove-student-component');
	else if (functinality == SEARCH)
		component = div('search-student-component');
	
	let type = select();
	for (let type_choice of constants.types)
		type.append_child(option().text(type_choice[1]).value(type_choice[0]));

	if (functinality == SEARCH)
		type.append_child(option().text(constants.type_all[1]).value(constants.type_all[0]));

	let values = select();
	for (let i = 0; i < storage.get_local_storage(constants.remarks).length; i++) 
		values.append_child(option().text(get_remark_func(i)).value(i));

	let submit_button = button().text('Supprimer etudiant passable').event('click', () => {
		let type_value = parseInt(type.get_value());
		values = component.get_child(1);
		let value = null;
		if (!type_value == constants.all)
			value = type_value == constants.remark ? parseInt(values.get_value()) : values.get_value();
		remove_students(type_value, value);
	});

	type.event('change', () => {
		let value = type.get_value();
		component.clear();
		component.append_child(type);
		if (value == constants.first_name || value == constants.last_name || value == constants.grade)
			component.insert_child(1, input());
		else if (value == constants.remark) 
			component.insert_child(1, values);
		component.append_child(submit_button);
	});

	return component.append_children([
		type,
		input(),
		submit_button,
	]);
}

export function remove_student_component() {
	return _compontent(REMOVE);
}

// modify this component be the same as remove_student_component
export function show_well_student_component() {
	return _compontent(SEARCH);

	return button().text('Afficher etudiants bien').event('click', () => {
		show_good_students();
	});
}

export function menu_component() {

	return div('menu-component').append_children([
		show_major_student_component(),
		show_all_students_component(),
		init_students_component(),
		remove_student_component(),
		show_well_student_component(),
	]);
}

function student_info_component(data, ) {
	return div('student-info-component').append_children([
		div().text('ID : ' + data.id),
		div().text('First Name: ' + data.first_name),
		div().text('Last Name: ' + data.last_name),
		div().text('Grade: ' + data.grade),
		div().text('Remark: ' + get_remark_func(data.remark))
	]);
}










// requests

function show_major_student_request() {
	return request('/get_major_student');
}

function show_all_students_request() {
	return request('/get_students');
}

function show_good_students_request() {
	return request('/get_good_students');
}








// views

function remove_students_request(type, value) {
	return request('/remove_students', {type, value});
}

function show_all_students_view(data) {
	result_element.clear().clear_classes().add_class('show-students');
	for (let student of data) {
		result_element.append_child(student_info_component(student));
	}
}

function show_major_student_view(data) {
	result_element.clear().clear_classes().add_class('show-major-student').append_children([
		div().text('Major student:'),
		student_info_component(data)
	]);	
}











// full functions

function show_major_student() {
	show_major_student_request().then(data => {
		console.log(data);
		show_major_student_view(data);
	});
}

export function show_all_students() {
	show_all_students_request().then(data => {
		console.log(data);
		show_all_students_view(data);
	});
}

function init_students() {
	request('/init_students');
	show_all_students();
}

function remove_students(type, value) {
	remove_students_request(type, value).then(() => {
		show_all_students();
	});
}


function show_good_students() {
	show_good_students_request().then(data => {
		show_all_students_view(data);
	});
}