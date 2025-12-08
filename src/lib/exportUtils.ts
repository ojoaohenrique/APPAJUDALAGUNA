import { Morador } from "@/types/morador";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Exporta um morador individual para JSON
 */
export const exportarMoradorJSON = (morador: Morador) => {
  const dataFormatada = {
    ...morador,
    data_nascimento: morador.data_nascimento 
      ? format(new Date(morador.data_nascimento), "dd/MM/yyyy", { locale: ptBR })
      : null,
    created_at: format(new Date(morador.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    updated_at: format(new Date(morador.updated_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
  };

  const blob = new Blob([JSON.stringify(dataFormatada, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `morador_${morador.nome_completo.replace(/\s+/g, "_")}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporta um morador individual para CSV
 */
export const exportarMoradorCSV = (morador: Morador) => {
  const headers = [
    "Nome Completo",
    "CPF",
    "Data de Nascimento",
    "Sexo",
    "Nome da Mãe",
    "Cidade Natal",
    "Profissão",
    "Recebe Auxílio",
    "Qual Auxílio",
    "Tempo em Situação de Rua",
    "Motivo da Situação de Rua",
    "Tempo em Laguna",
    "Tempo Pretende Ficar",
    "Local de Abordagem",
    "Bairro",
    "Rua",
    "Informações do Local",
    "Possui Vícios",
    "Quais Vícios",
    "Passagens Polícia",
    "Observações Passagens",
    "Abordagens Anteriores",
    "Procurou Assistência Social",
    "Qual Serviço Procurou",
    "Observações",
    "Data de Cadastro",
    "Cadastrado Por",
  ];

  const values = [
    morador.nome_completo || "",
    morador.cpf || "",
    morador.data_nascimento
      ? format(new Date(morador.data_nascimento), "dd/MM/yyyy", { locale: ptBR })
      : "",
    morador.sexo || "",
    morador.nome_mae || "",
    morador.cidade_natal || "",
    morador.profissao || "",
    morador.recebe_auxilio ? "Sim" : "Não",
    morador.qual_auxilio || "",
    morador.tempo_situacao_rua || "",
    morador.motivo_situacao_rua || "",
    morador.tempo_em_laguna || "",
    morador.tempo_pretende_ficar || "",
    morador.local_abordagem || "",
    morador.bairro || "",
    morador.rua || "",
    morador.informacoes_local || "",
    morador.possui_vicios ? "Sim" : "Não",
    morador.quais_vicios || "",
    morador.passagens_policia ? "Sim" : "Não",
    morador.observacoes_passagens || "",
    morador.abordagens_anteriores || "",
    morador.procurou_assistencia_social ? "Sim" : "Não",
    morador.qual_servico_procurou || "",
    morador.observacoes || "",
    format(new Date(morador.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    morador.criado_por_nome || "",
  ];

  // Escapar valores que contêm vírgulas ou quebras de linha
  const escapedValues = values.map((value) => {
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  });

  const csv = [headers.join(","), escapedValues.join(",")].join("\n");

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `morador_${morador.nome_completo.replace(/\s+/g, "_")}_${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporta todos os moradores para CSV
 */
export const exportarTodosMoradoresCSV = (moradores: Morador[]) => {
  const headers = [
    "Nome Completo",
    "CPF",
    "Data de Nascimento",
    "Sexo",
    "Nome da Mãe",
    "Cidade Natal",
    "Profissão",
    "Recebe Auxílio",
    "Qual Auxílio",
    "Tempo em Situação de Rua",
    "Motivo da Situação de Rua",
    "Tempo em Laguna",
    "Tempo Pretende Ficar",
    "Local de Abordagem",
    "Bairro",
    "Rua",
    "Informações do Local",
    "Possui Vícios",
    "Quais Vícios",
    "Passagens Polícia",
    "Observações Passagens",
    "Abordagens Anteriores",
    "Procurou Assistência Social",
    "Qual Serviço Procurou",
    "Observações",
    "Data de Cadastro",
    "Cadastrado Por",
  ];

  const rows = moradores.map((morador) => {
    const values = [
      morador.nome_completo || "",
      morador.cpf || "",
      morador.data_nascimento
        ? format(new Date(morador.data_nascimento), "dd/MM/yyyy", { locale: ptBR })
        : "",
      morador.sexo || "",
      morador.nome_mae || "",
      morador.cidade_natal || "",
      morador.profissao || "",
      morador.recebe_auxilio ? "Sim" : "Não",
      morador.qual_auxilio || "",
      morador.tempo_situacao_rua || "",
      morador.motivo_situacao_rua || "",
      morador.tempo_em_laguna || "",
      morador.tempo_pretende_ficar || "",
      morador.local_abordagem || "",
      morador.bairro || "",
      morador.rua || "",
      morador.informacoes_local || "",
      morador.possui_vicios ? "Sim" : "Não",
      morador.quais_vicios || "",
      morador.passagens_policia ? "Sim" : "Não",
      morador.observacoes_passagens || "",
      morador.abordagens_anteriores || "",
      morador.procurou_assistencia_social ? "Sim" : "Não",
      morador.qual_servico_procurou || "",
      morador.observacoes || "",
      format(new Date(morador.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
      morador.criado_por_nome || "",
    ];

    // Escapar valores
    return values.map((value) => {
      const stringValue = String(value);
      if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `todos_moradores_${format(new Date(), "dd-MM-yyyy_HH-mm")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporta todos os moradores para JSON
 */
export const exportarTodosMoradoresJSON = (moradores: Morador[]) => {
  const dadosFormatados = moradores.map((morador) => ({
    ...morador,
    data_nascimento: morador.data_nascimento
      ? format(new Date(morador.data_nascimento), "dd/MM/yyyy", { locale: ptBR })
      : null,
    created_at: format(new Date(morador.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    updated_at: format(new Date(morador.updated_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
  }));

  const blob = new Blob([JSON.stringify(dadosFormatados, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `todos_moradores_${format(new Date(), "dd-MM-yyyy_HH-mm")}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
