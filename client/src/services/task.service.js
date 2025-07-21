// task.service.js
import { supabase } from './supabase.service'

const TABLE_NAME = 'tareas'

export const getTasks = async (page = 1, limit = 10, search = '') => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from(TABLE_NAME)
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.ilike('titulo', `%${search}%`)
  }

  const { data, count, error } = await query

  if (error) throw error
  return { data, count }
}

export const createTask = async (taskData) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([taskData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateTask = async (id, taskData) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(taskData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteTask = async (id) => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
