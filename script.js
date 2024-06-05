document.addEventListener('DOMContentLoaded', () => {
	fetchData();
});

async function fetchData() {
	try {
		const response = await fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
			method: 'GET',
			headers: new Headers({
				Authorization: 'Basic ' + btoa('coalition:skills-test'),
			}),
		});
		if (!response.ok) {
			throw new Error('Network response was not ok.');
		}
		const data = await response.json();
		const patientData = data[3];

		populatePatientList(data);

		if (patientData) {
			populatePatientInfo(patientData);
			patientData.lab_results && populateLabResults(patientData.lab_results);
			patientData.diagnostic_list && populateDiagnosticList(patientData.diagnostic_list);
			const graphData = patientData.diagnosis_history.slice(0, 6);
			createBloodPressureChart(graphData.reverse());
		}
	} catch (error) {
		console.error('Error:', error);
	}
}

function populatePatientList(patients) {
	const list = document.getElementById('patientList');
	patients.forEach((patient) => {
		const item = document.createElement('li');
		if (patient.name && patient.name === "Jessica Taylor") {
			item.className = 'patient-list-item active';
		}
		else {
			item.className = 'patient-list-item';
		}
		item.innerHTML = `
					<div class="content">
							<img src="${patient.profile_picture}" alt="${patient.name}" class="profile-image"/>
							<div class="list-item-wrap">
									<div class="title">${patient.name}</div>
									<div class="description-wrap">
											<span class="gender">${patient.gender}</span>
											<span class="age">${patient.age}</span>
									</div>
							</div>
					</div>
					<img class="more-horizontal" src="./assets/icon-more-horizontal.svg" alt="More options icon"/>
			`;
		list.appendChild(item);
	});
}

function populatePatientInfo(data) {
	document.getElementById('profile-img').src = data.profile_picture;
	document.getElementById('patient-name').textContent = data.name;
	document.getElementById('patient-dob').textContent = data.date_of_birth;
	document.getElementById('patient-gender').textContent = data.gender;
	document.getElementById('patient-contact').textContent = data.phone_number;
	document.getElementById('patient-emergency-contact').textContent = data.emergency_contact;
	document.getElementById('patient-insurance-provider').textContent = data.insurance_type;

	const diagnosis = data.diagnosis_history[0];
	document.getElementById('patient-systolic-value').textContent = diagnosis.blood_pressure.systolic.value;
	document.getElementById('patient-systolic-level').textContent = diagnosis.blood_pressure.systolic.levels;
	document.getElementById('patient-diastolic-value').textContent = diagnosis.blood_pressure.diastolic.value;
	document.getElementById('patient-diastolic-level').textContent = diagnosis.blood_pressure.diastolic.levels;
	document.getElementById('patient-respiratory-rate-value').textContent = diagnosis.heart_rate.value + ' bpm';
	document.getElementById('patient-respiratory-rate-level').textContent = diagnosis.heart_rate.levels;
	document.getElementById('patient-temperature-value').textContent = diagnosis.temperature.value + ' °F';
	document.getElementById('patient-temperature-level').textContent = diagnosis.temperature.levels;
	document.getElementById('patient-heart-rate-value').textContent = diagnosis.respiratory_rate.value + ' bpm';
	document.getElementById('patient-heart-rate-level').textContent = diagnosis.respiratory_rate.levels;
}

function populateLabResults(data) {
	const list = document.getElementById('lab-results-list');
	data.forEach((labResult) => {
		const item = document.createElement('li');
		item.className = 'list-item';
		item.innerHTML = `
					<div class="title">${labResult}</div>
					<img src="./assets/icon-download.svg" alt="Download icon"/>
			`;
		list.appendChild(item);
	});
}

function populateDiagnosticList(data) {
	const list = document.getElementById('content-list');
	list.innerHTML = null;
	data.forEach((diagnostic) => {
		const item = document.createElement('li');
		item.className = 'content-list-item';
		item.innerHTML = `
					<div>${diagnostic.name}</div>
					<div>${diagnostic.description}</div>
					<div>${diagnostic.status}</div>
			`;
		list.appendChild(item);
	});
}

function createBloodPressureChart(graphData) {
	const months = graphData.map((data) => `${data.month.trim().substring(0, 3)}, ${data.year}`);
	const systolicValues = graphData.map((data) => data.blood_pressure.systolic.value);
	const diastolicValues = graphData.map((data) => data.blood_pressure.diastolic.value);

	const ctx = document.getElementById('bpChart').getContext('2d');
	const bpChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: months,
			datasets: [
				{
					label: 'Systolic Pressure',
					data: systolicValues,
					borderColor: '#E66FD2',
					backgroundColor: '#E66FD2',
					fill: false,
				},
				{
					label: 'Diastolic Pressure',
					data: diastolicValues,
					borderColor: '#8C6FE6',
					backgroundColor: '#8C6FE6',
					fill: false,
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: false,
				},
			},
			responsive: true,
		},
	});
}
