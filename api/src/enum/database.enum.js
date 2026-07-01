export async function taskEnum(taskEnum){
    if(taskEnum != "Pendente" && taskEnum != "Em andamento" && taskEnum != "Concluída"){
        return res.status(400).json({
            message: `O status deve ser: Pendente, Em andamento, Concluida`
        })
    }
} 