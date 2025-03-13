// new version - correct

'use client';

import { useState } from 'react';
import { use, useActionState } from 'react';

import styles from './ModalAddNewUserAdmin.module.scss';
import Image from 'next/image';

import SchoolClassContextProvider from '../../contexts/SchoolClassContext';
import SubjectContextProvider, { SubjectContext } from '../../contexts/SubjectContext';

import { DropdownMenuSelectSubject } from '../DropdownMenuSelectSubject/DropdownMenuSelectSubject';
import { TextInput } from '../TextInput/TextInput';
import { PasswordInput } from '../PasswordInput/PasswordInput';

import CloseIcon from '/public/icons/x-icon.svg';
import { PeopleIcon } from '../../icons/PeopleIcon';
import { EmailIcon } from '../../icons/EmailIcon';
import { PhoneIcon } from '../../icons/PhoneIcon';
import { LockIcon } from '../../icons/LockIcon';
import { EmailInput } from '../LoginInput/EmailInput';
import { ModalAddNewUserAdminProps } from '../../types/principalPanelProps';

export function ModalAddNewUserAdmin({ isModalVisible, setIsModalVisible }: ModalAddNewUserAdminProps) {
	return (
		<SubjectContextProvider>
			<SchoolClassContextProvider>
				<ModalContent isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
			</SchoolClassContextProvider>
		</SubjectContextProvider>
	);
}

function ModalContent({ isModalVisible, setIsModalVisible }: ModalAddNewUserAdminProps) {
	// Teraz pobieramy wartość kontekstu już wewnątrz providera
	const { subject } = use(SubjectContext);

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const togglePasswordVisibility = () => {
		setIsPasswordVisible((prevState) => !prevState);
	};

	const [state, formAction] = useActionState(handleSubmit, {
		userType: 'teacher',
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		password: '',
		subject: '',
	});

	const [formValues, setFormValues] = useState({
		userType: state.userType || 'teacher',
		firstName: state.firstName || '',
		lastName: state.lastName || '',
		email: state.email || '',
		phone: state.phone || '',
		password: state.password || '',
		subject: subject,
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({ ...prev, [name]: value }));
	};

	function handleSubmit(_previousState, formData: FormData) {
		const submittedData = {
			userType: formData.get('userType'),
			firstName: formData.get('firstName'),
			lastName: formData.get('lastName'),
			email: formData.get('email'),
			phone: formData.get('phone'),
			password: formData.get('password'),
			// Używamy aktualnej wartości subject z kontekstu
			subject: subject,
		};
		console.log('Submitted form data:', submittedData);
		setIsModalVisible(false);
		return submittedData;
	}

	return (
		<div className={`${styles.modalContainer} ${isModalVisible ? styles.active : ''}`}>
			<span className={styles.overlay}></span>
			<div className={styles.modalOpened}>
				<div className={styles.modalContent}>
					<div className={styles.actionMenu}>
						<span className={styles.blank}></span>
						<p className={styles.heading}>New user</p>
						<Image
							src={CloseIcon}
							alt='Close icon'
							aria-label='Close button'
							onClick={() => setIsModalVisible(false)}
						/>
					</div>

					<form action={formAction} className={styles.form}>
						<div className={styles.radioGroup}>
							<p className={styles.heading}>User type</p>
							<label className={styles.radioItem}>
								<input
									type='radio'
									name='userType'
									value='teacher'
									checked={formValues.userType === 'teacher'}
									onChange={handleInputChange}
								/>
								<span className={styles.radioCustom}></span>
								Teacher
							</label>

							<label className={styles.radioItem}>
								<input
									type='radio'
									name='userType'
									value='parentAndStudent'
									checked={formValues.userType === 'parentAndStudent'}
									onChange={handleInputChange}
								/>
								<span className={styles.radioCustom}></span>
								Parent &amp; Student
							</label>
						</div>

						{/* subject */}
						<div className={styles.required}>
							<label htmlFor='subject'>Subject</label>
						</div>
						<DropdownMenuSelectSubject />

						{/* name */}
						<div className={styles.required}>
							<label htmlFor='firstName'>Name</label>
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor='firstName' className={styles.iconContainer}>
								<PeopleIcon className={styles.inputIcon} />
							</label>
							<TextInput
								id='firstName'
								name='firstName'
								placeholder='ex. John'
								value={formValues.firstName}
								onChange={handleInputChange}
							/>
						</div>

						{/* surname */}
						<div className={styles.required}>
							<label htmlFor='lastName'>Surname</label>
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor='lastName' className={styles.iconContainer}>
								<PeopleIcon className={styles.inputIcon} />
							</label>
							<TextInput
								id='lastName'
								name='lastName'
								placeholder='ex. Doe'
								value={formValues.lastName}
								onChange={handleInputChange}
							/>
						</div>

						{/* email */}
						<div className={styles.required}>
							<label htmlFor='email-input'>E-mail</label>
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor='email-input' className={styles.iconContainer}>
								<EmailIcon className={styles.inputIcon} />
							</label>
							<EmailInput
								name='email'
								placeholder='ex. johndoe@gmail.com'
								value={formValues.email}
								onChange={handleInputChange}
							/>
						</div>

						{/* phone */}
						<div className={styles.required}>
							<label htmlFor='phone'>Phone number</label>
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor='phone' className={styles.iconContainer}>
								<PhoneIcon className={styles.inputIcon} />
							</label>
							<TextInput
								id='phone'
								name='phone'
								placeholder='ex. +1 123456789'
								value={formValues.phone}
								onChange={handleInputChange}
							/>
						</div>

						{/* password */}
						<div className={styles.required}>
							<label htmlFor='password-input'>Password</label>
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor='password-input' className={styles.iconContainer}>
								<LockIcon className={styles.inputIcon} />
							</label>
							<PasswordInput
								name='password'
								placeholder='Set the user password'
								value={formValues.password}
								onChange={handleInputChange}
								type={isPasswordVisible ? 'text' : 'password'}
							/>
							<span
								className={styles.toggleVisibility}
								aria-label='show or hide password button'
								tabIndex={0}
								onClick={togglePasswordVisibility}>
								{isPasswordVisible ? '🔓' : '🔒'}
							</span>
						</div>

						{/* submit button */}
						<div className={styles.btnContainer}>
							<button type='submit' className={styles.submitBtn}>
								POST
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

// old version (incorrect)
// 'use client';

// import styles from './ModalAddNewUserAdmin.module.scss';

// import Image from 'next/image';

// import { use, useState } from 'react';
// import { useActionState } from 'react';

// import SchoolClassContextProvider from '../../contexts/SchoolClassContext';
// import SubjectContextProvider, { SubjectContext } from '../../contexts/SubjectContext';

// import { DropdownMenuSelectSubject } from '../DropdownMenuSelectSubject/DropdownMenuSelectSubject';
// import { TextInput } from '../TextInput/TextInput';
// import { PasswordInput } from '../PasswordInput/PasswordInput';

// import CloseIcon from '/public/icons/x-icon.svg';
// import { PeopleIcon } from '../../icons/PeopleIcon';
// import { EmailIcon } from '../../icons/EmailIcon';
// import { PhoneIcon } from '../../icons/PhoneIcon';
// import { LockIcon } from '../../icons/LockIcon';
// import { EmailInput } from '../LoginInput/EmailInput';
// import { ModalAddNewUserAdminProps } from '../../types/principalPanelProps';

// export function ModalAddNewUserAdmin({ isModalVisible, setIsModalVisible }: ModalAddNewUserAdminProps) {
// 	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

// 	const togglePasswordVisibility = () => {
// 		setIsPasswordVisible((prevState) => !prevState);
// 	};

// 	const [state, formAction] = useActionState(handleSubmit, {
// 		userType: 'teacher',
// 		firstName: '',
// 		lastName: '',
// 		email: '',
// 		phone: '',
// 		password: '',
// 		subject: '',
// 	});

// 	const { subject } = use(SubjectContext);

// 	const [formValues, setFormValues] = useState({
// 		userType: state.userType || 'teacher',
// 		firstName: state.firstName || '',
// 		lastName: state.lastName || '',
// 		email: state.email || '',
// 		phone: state.phone || '',
// 		password: state.password || '',
// 		subject: subject,
// 	});

// 	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const { name, value } = e.target;
// 		setFormValues((prev) => ({ ...prev, [name]: value }));
// 	};

// 	function handleSubmit(_previousState, formData: FormData) {
// 		const submittedData = {
// 			userType: formData.get('userType'),
// 			firstName: formData.get('firstName'),
// 			lastName: formData.get('lastName'),
// 			email: formData.get('email'),
// 			phone: formData.get('phone'),
// 			password: formData.get('password'),
// 			subject: subject,
// 		};
// 		console.log('Submitted form data:', submittedData);

// 		setIsModalVisible(false);

// 		return submittedData;
// 	}

// 	return (
// 		<SchoolClassContextProvider>
// 			<SubjectContextProvider>
// 				<div className={`${styles.modalContainer} ${isModalVisible ? styles.active : ''}`}>
// 					<span className={styles.overlay}></span>
// 					<div className={styles.modalOpened}>
// 						<div className={styles.modalContent}>
// 							<div className={styles.actionMenu}>
// 								<span className={styles.blank}></span>
// 								<p className={styles.heading}>New user</p>
// 								<Image
// 									src={CloseIcon}
// 									alt='Close icon'
// 									aria-label='Close button'
// 									onClick={() => setIsModalVisible(false)}
// 								/>
// 							</div>

// 							<form action={formAction} className={styles.form}>
// 								<div className={styles.radioGroup}>
// 									<p className={styles.heading}>User type</p>
// 									<label className={styles.radioItem}>
// 										<input
// 											type='radio'
// 											name='userType'
// 											value='teacher'
// 											checked={formValues.userType === 'teacher'}
// 											onChange={handleInputChange}
// 										/>
// 										<span className={styles.radioCustom}></span>
// 										Teacher
// 									</label>

// 									<label className={styles.radioItem}>
// 										<input
// 											type='radio'
// 											name='userType'
// 											value='parentAndStudent'
// 											checked={formValues.userType === 'parentAndStudent'}
// 											onChange={handleInputChange}
// 										/>
// 										<span className={styles.radioCustom}></span>
// 										Parent & Student
// 									</label>
// 								</div>

// 								{/* subject */}
// 								<div className={styles.required}>
// 									<label htmlFor='subject'>Subject</label>
// 								</div>

// 								<DropdownMenuSelectSubject />

// 								{/* name */}
// 								<div className={styles.required}>
// 									<label htmlFor='firstName'>Name</label>
// 								</div>
// 								<div className={styles.inputContainer}>
// 									<label htmlFor='firstName' className={styles.iconContainer}>
// 										<PeopleIcon className={styles.inputIcon} />
// 									</label>

// 									<TextInput
// 										id='firstName'
// 										name='firstName'
// 										placeholder='ex. John'
// 										value={formValues.firstName}
// 										onChange={handleInputChange}
// 									/>
// 								</div>

// 								{/* surname */}
// 								<div className={styles.required}>
// 									<label htmlFor='lastName'>Surname</label>
// 								</div>
// 								<div className={styles.inputContainer}>
// 									<label htmlFor='lastName' className={styles.iconContainer}>
// 										<PeopleIcon className={styles.inputIcon} />
// 									</label>

// 									<TextInput
// 										id='lastName'
// 										name='lastName'
// 										placeholder='ex. Doe'
// 										value={formValues.lastName}
// 										onChange={handleInputChange}
// 									/>
// 								</div>

// 								{/* email */}
// 								<div className={styles.required}>
// 									<label htmlFor='email-input'>E-mail</label>
// 								</div>
// 								<div className={styles.inputContainer}>
// 									<label htmlFor='email-input' className={styles.iconContainer}>
// 										<EmailIcon className={styles.inputIcon} />
// 									</label>

// 									<EmailInput
// 										name='email'
// 										placeholder='ex. johndoe@gmail.com'
// 										value={formValues.email}
// 										onChange={handleInputChange}
// 									/>
// 								</div>

// 								{/* phone */}
// 								<div className={styles.required}>
// 									<label htmlFor='phone'>Phone number</label>
// 								</div>

// 								<div className={styles.inputContainer}>
// 									<label htmlFor='phone' className={styles.iconContainer}>
// 										<PhoneIcon className={styles.inputIcon} />
// 									</label>

// 									<TextInput
// 										id='phone'
// 										name='phone'
// 										placeholder='ex. +1 123456789'
// 										value={formValues.phone}
// 										onChange={handleInputChange}
// 									/>
// 								</div>

// 								{/* password */}
// 								<div className={styles.required}>
// 									<label htmlFor='password-input'>Password</label>
// 								</div>

// 								<div className={styles.inputContainer}>
// 									<label htmlFor='password-input' className={styles.iconContainer}>
// 										<LockIcon className={styles.inputIcon} />
// 									</label>
// 									<PasswordInput
// 										name='password'
// 										placeholder='Set the user password'
// 										value={formValues.password}
// 										onChange={handleInputChange}
// 										type={isPasswordVisible ? 'text' : 'password'}
// 									/>

// 									<span
// 										className={styles.toggleVisibility}
// 										aria-label='show or hide password button'
// 										tabIndex={0}
// 										onClick={togglePasswordVisibility}>
// 										{isPasswordVisible ? '🔓' : '🔒'}
// 									</span>
// 								</div>

// 								{/* submit button */}
// 								<div className={styles.btnContainer}>
// 									<button type='submit' className={styles.submitBtn}>
// 										POST
// 									</button>
// 								</div>
// 							</form>
// 						</div>
// 					</div>
// 				</div>
// 			</SubjectContextProvider>
// 		</SchoolClassContextProvider>
// 	);
// }
