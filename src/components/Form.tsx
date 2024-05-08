import { ChangeEvent, Dispatch, FormEvent, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { categories } from "../data/categories";
import { Activity } from "../types";
import { ActivityActions, ActivityState } from "../reducers/activity-reducer";

type FormProps = {
   dispatch: Dispatch<ActivityActions>,
   state: ActivityState
}

const initialState: Activity = {
   id: uuidv4(),
   category: 1,
   name: '',
   calories: 0
}

export default function Form({dispatch, state}: FormProps) {

   const [activity, setActivity] = useState<Activity>(initialState)

   useEffect(() => {
     if (state.activeId) {
      const selectedActivity = state.activities.filter( stateActivity => stateActivity.id === state.activeId )[0]
      setActivity(selectedActivity)
     }
   }, [state.activeId])
   

   const handleChange = (event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
      
      const isNumberField = ['category','calories'].includes(event.target.id)

      setActivity({
         ...activity,
         [event.target.id]: isNumberField ? 
                                 Number(event.target.value) :
                                 event.target.value
      })
   }

   const isValidActivity = () => {
      return activity.name.trim() != '' && activity.calories > 0
   }

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      dispatch({type: 'save-activity', payload: {newActivity: activity}})

      setActivity({
         ...initialState,
         id: uuidv4()
      })
   }

   return (
      <form
         className="space-y-5 bg-white p-10 rounded-lg shadow"
         onSubmit={handleSubmit}
      >
         <div className="grid grid-cols-1 gap-3">
            <label htmlFor='category' className="font-bold">Categoría:</label>
            <select
               className="border border-slate-300 p-2 rounded-lg w-full bg-white"
               id='category'
               value={activity.category}
               onChange={handleChange}
            >
               {categories.map(category => (
                  <option
                     key={category.id}
                     value={category.id}
                  >
                     {category.name}
                  </option>
               ))}
               Opcion
            </select>
         </div>

         <div className="grid grid-cols-1 gap-3">
            <label htmlFor='name' className="font-bold">Actividad:</label>
            <input 
               className="border border-slate-300 p-2 rounded-lg"
               id='name'
               type='text'
               placeholder="Ej. Comida, Jugo, Ensalada, Ejercicio, Pesas, Bicicleta"
               value={activity.name}
               onChange={handleChange}
            />
         </div>

         <div className="grid grid-cols-1 gap-3">
            <label htmlFor='calories' className="font-bold">Calorias:</label>
            <input 
               className="border border-slate-300 p-2 rounded-lg"
               id='calories'
               type='number'
               placeholder="Ej. 30, 500"
               value={activity.calories}
               onChange={handleChange}
            />
         </div>

         <input
            className="bg-gray-800 hover:bg-gray-900 w-full p-2 text-white font-bold uppercase cursor-pointer disabled:opacity-10"
            type="submit"
            value={activity.category === 1 ? 'Guardar comida' : 'Guardar ejercicio'}
            disabled={!isValidActivity()}
         />
      </form>
   )
}