
/**
 * @typedef {object} Statement 
 * @property {boolean} agree
 * @property {string} text
 * @property {number[]?} required
 * @property {number[]?} prevents
 * @property {number[]?} overwrites
 */



document.getElementById('submit').addEventListener('click', e=>{
	e.preventDefault()
})

/**
 * @type {Statement}
 */
const statements = [
	{
		agree:false,
		text:'I am above 18',
		requires:[2,3]
	},
	{
		agree:false,
		text:'I am willing to share user info. (id is not needed)',
		overwrites:[3],
		requires:[1],
		prevents:[3]
	},
	{
		agree:false,
		text:'I am willing to share id and im above 21',
	}
]
const terms = {
	condition:'at least',
	amount:2
}



function createFrom(statements, terms) {
	const form = document.getElementById('form')
	while (form.hasChildNodes()) {
		form.firstChild.remove()
	}
	for (const statement of statements) {
		const input = document.createElement('input')
		input.type = 'checkbox'
		form.append(input)
		const label = document.createElement('label')
		label.textContent = statement.text
		form.append(label)
		form.innerHTML += '<br>'
	}
	document.getElementById('final-label').textContent = `I agree to terms and conditions on ${terms.condition} ${terms.amount} previous statements`
}



/**
 * Validates forum results
 * @param {Statement[]} statements 
 * @param {any} terms 
 * @returns {any}
 */
function ValidateForm(statements, terms){
	for (let i=0;i<statements.length;i++) {
		const statement = statements[i]
		if (statement.required) {
			const conflicts = statement.required.filter(idx=>!statements[idx-1].agree)
			if (conflicts.length > 0) return {
				valid:false, invalidStatement:idx+1, reason:{
					message:`missing requirements`
				}
			}
		}
		if (statement.prevents) {
			const conflicts = statement.prevents.filter(idx=>statements[idx-1].agree)
			if (conflicts.length > 0) return {
				valid:false, invalidStatement:idx+1, reason:{
					message:`incompatible agreements`
				}
			}
		}
	}
}

createFrom(statements, terms)
