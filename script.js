
/**
 * @typedef {object} Statement 
 * @property {boolean} agree
 * @property {string} text
 * @property {Filter|number} [required]
 * @property {Filter|number} [prevents]
 * @property {number[]} [overwrites]
 */

/**
 * @typedef {AndFilter|OrFilter} Filter
 */

/**
 * @typedef {object} AndFilter
 * @property {'and'} filter
 * @property {Array<Filter|number>} content
 */

/**
 * @typedef {object} OrFilter
 * @property {'or'} filter
 * @property {Array<Filter|number>} content
 */

/**
 * @type {Statement}
 */
const statements = [
	{
		agree:false,
		text:'I am above 18',
		required:2
	},
	{
		agree:false,
		text:'I am willing to share id',
	}
]
const terms = {
	agree:false,
	condition:'at least',
	amount:1
}


document.getElementById('final').addEventListener('input', ()=>{
	terms.agree = document.getElementById('final').checked
	console.log(terms)
})



function createFrom(statements, terms) {
	const form = document.getElementById('form')
	form.innerHTML = ''
	for (const statement of statements) {
		const input = document.createElement('input')
		input.type = 'checkbox'
		input.addEventListener('input', ()=>{
			statement.agree = input.checked
			console.log(statements)
		})
		form.append(input)
		const label = document.createElement('label')
		label.textContent = statement.text
		form.append(label)
		form.append(document.createElement('br'))
	}
	document.getElementById('final-label').textContent = `I agree to terms and conditions on ${terms.condition} ${terms.amount} previous statements`
}



function validateStatement(n, required, statements){
	if (required) {
		return statements[n-1].agree
	} else { //If not required, assume expelled/whatever the opposite of required is
		return !statements[n-1].agree
	}
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
		if (!statement.agree) continue

		if (typeof statement.required === 'number') {
			if (!validateStatement(statement.required, true, statements)) return {
				valid:false,
				invalidStatement:i+1,
				reason:{
					message:`missing requirements`,
					conflicts:[statement.required]
				}
			}
		} else if (statement.required) {
			const conflicts = validateFilter(statement.required, true, statements)
			if (conflicts.length > 0) return {
				valid:false,
				invalidStatement:i+1,
				reason:{
					message:`missing requirements`,
					conflicts
				}
			}
		}

		if (typeof statement.prevents === 'number') {
			if (!validateStatement(statement.prevents, false, statements)) return {
				valid:false,
				invalidStatement:i+1,
				reason:{
					message:`incompatible agreements`,
					conflicts:[statement.prevents]
				}
			}
		} else if (statement.prevents) {
			const conflicts = validateFilter(statement.prevents, false, statements)
			if (conflicts.length > 0) return {
				valid:false,
				invalidStatement:i+1,
				reason:{
					message:`incompatible agreements`,
					conflicts
				}
			}
		}

	}

	if (!terms.agree) return {
		valid:false,
		invalidStatement:'terms',
		reason:{
			message:`not agree with terms`,
		}
	}

	let sum = 0
	for (const s of statements) {
		if (s.agree) sum++
		if (sum >= terms.amount) return {valid:true}
	}
	
	return {
		valid:false,
		invalidStatement:'terms',
		reason:{
			message:`not enough agreements`,
			agreements: sum
		}
	}
}


/**
 * 
 * @param {Filter} filter 
 * @param {boolean} required
 * @param {Statement[]} statements 
 * @returns {number[]} conflicts
 */
function validateFilter(filter, required, statements) {
	const conflicts = []

	filter.content.forEach(v=>{
		if (typeof v === 'number') {
			if (!validateStatement(v, required, statements)) conflicts.push(v)
		} else {
			conflicts.push(...validateFilter(v, required, statements))
		}
	})

	if (filter.filter === 'and') {
		return conflicts
	} else if (filter.filter === 'or') {
		return conflicts.length === filter.content.length ? conflicts : []
	}
	
	return []
}

createFrom(statements, terms)

document.getElementById('submit').addEventListener('click', e=>{
	e.preventDefault()
	console.log(ValidateForm(statements, terms))
})
